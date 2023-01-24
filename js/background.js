console.log("background.js loaded");

const CONFIG = {
    my_user_name: 'LettyWong',
    my_token: `eyJhbGciOiJIUzI1N
iIsInR5cCI6IkpXVCJ9.
eyJ1c2VySWQiOiJsZXR0eX
dvbmciLCJ1c2Vybm
FtZSI6Imxl
dHR5d29uZyIsImxldmVsI
jowLCJndmVyIjoi
MkU2NTkxOEYi
LCJjdmVyIjoiTTQ4T
lg3Iiwia
WF0IjoxNjcyNzQ5N
jU1LCJl
eHAiOjE5ODgxMDk2N
TV9.ZKmZZz
XDRTl4Uv-aAPAcy9A
btsHvnQ3
otVsHOUpupwQ`,
    follow_batch_size: 20,
    follow_action_interval: 60,
    follow_limit_hit: false,
};

const changeable_keys = [
    'my_user_name',
    'my_token',
    'follow_batch_size',
    'follow_action_interval',
];



function get_my_token() {
    return CONFIG.my_token.replaceAll(/\s/g, '')
}



async function follow_one(user) {
    let my_user_name = CONFIG.my_user_name.toLowerCase()
    let url = `https://api.gettr.com/u/user/${my_user_name}/follows/${user}`

    let resp = await fetch(url, {
        method: 'POST',
        body: '',
        headers: {
            'x-app-auth': JSON.stringify({"user": my_user_name, "token": get_my_token()})
        }
    }).then(response => response.json());
    if (resp.rc !== 'OK') {
        if (resp.rc === 'E_METER_LIMIT_EXCEEDED') {
            CONFIG.follow_limit_hit = true;
        }
        console.log(`operation: follow ${user} failed, result`, resp)
    } else {
        CONFIG.follow_limit_hit = false;
    }

}

async function follow_batch(start_user, cursor) {
    let my_user_name = CONFIG.my_user_name.toLowerCase()
    let url = `https://api.gettr.com/u/user/${start_user}/followers`;
    let paras = {
        max: `${CONFIG.follow_batch_size}`,
        incl: 'userstats|userinfo|followings|followers',
    };
    if (cursor) {
        paras['cursor'] = cursor;
    }
    url = url + '?' + new URLSearchParams().toString();

    let resp = await fetch(url, {
        method: 'GET',
        headers: {
            'x-app-auth': JSON.stringify({"user": my_user_name, "token": get_my_token()})
        }
    }).then(response => response.json());

    if (resp.rc === 'OK') {
        let followers = resp?.result?.aux?.uinf;
        if (followers) {
            for (let id in followers) {
                let user_info = followers[id];
                await follow_one(user_info['username'])
            }
        }

        let cursor = resp?.result?.aux?.cursor;
        if (cursor) {
            let timeout = CONFIG.follow_action_interval * 1000;
            setTimeout(function () {
                follow_batch(start_user, cursor);
            }, timeout)
            return cursor;
        }
    } else {
        console.log(`failed to get followers from ${start_user}`, resp)
    }
    return undefined;
}




async function follow_others(user_name) {
    let cursor = undefined;
    let timeout = CONFIG.follow_action_interval * 1000;

    setTimeout(function () {
        follow_batch(user_name, cursor)
    }, timeout);
}

async function msg_handler(request, sender, sendResponse) {
    let resp = {};
    if (request.cmd === 'GET_CONFIG') {
    } else if (request.cmd === 'SET_CONFIG') {
        console.log(`background receive request:`, request);
        for (let key in request) {
            if (changeable_keys.indexOf(key) >= 0) {
                if (CONFIG[key] !== request[key]) {
                    console.log(`change config ${key} to ${request[key]} from ${CONFIG[key]}`);
                    CONFIG[key] = request[key];
                    let resp = await chrome.storage.sync.set({"CONFIG": CONFIG});
                    console.log('save CONFIG to cache done', resp);


                }
            }
        }
    } else if (request.cmd === 'FOLLOW') {
        console.log(`background receive request:`, request);
        let user_name = request.user;
        await follow_others(user_name);
    } else {
        console.log(`background receive request:`, request);
    }
    sendResponse({...CONFIG, ...resp});
}


chrome.runtime.onMessage.addListener(msg_handler);


