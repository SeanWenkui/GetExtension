console.log("background.js loaded");

const CONFIG = {
    follow_enabled: false,
    my_user_name: 'seanzhang',
    start_user: 'lettywong',
    my_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzZWFuemhhbmciLCJ1c2VybmFtZSI6InNlYW56aGFuZyIsImxldmVsIjowLCJndmVyIjoiMkU2NTkxOEYiLCJjdmVyIjpudWxsLCJpYXQiOjE2NzQ2MTYzOTcsImV4cCI6MTY3NzIwODM5N30.9eFCyiDGld8kX45npzd8Q9KjzpNO-ZpSmGjXCCE5uHU',
    follow_batch_size: 20,
    follow_one_interval_second: 10,
    follow_batch_interval_minutes: 10,
    follow_limit_hit: false,
    still_working: true,
};

const changeable_keys = [
    'follow_enabled',
    'my_user_name',
    'my_token',
    'start_user',
    'follow_batch_size',
    'follow_one_interval_second',
    'follow_batch_interval_minutes',
];
const CONFIG_GETTR = 'CONFIG_GETTR';

let original_lines = [];

const known_users = [];



function main_entry() {
    set_token(CONFIG.my_token);
    chrome.storage.sync.get([CONFIG_GETTR], function(items) {
        console.log('items from cache', items);
        if (CONFIG_GETTR in items) {
            let cache_values = items[CONFIG_GETTR];
            for (let key in cache_values) {
                if (changeable_keys.indexOf(key) >= 0) {
                    CONFIG[key] = cache_values[key];
                    console.log('CONFIG ' + key + ' = ' + CONFIG[key]);
                }
            }
        }

        setInterval(follow_others, 1000);
    });

    import_text_file('post_content.js');
}

function import_text_file(one_file) {
    try {
        importScripts(one_file);
        original_lines = file_content.split('\n');
    } catch (e) {
        console.warn(e);
    }
}

main_entry();


function get_my_token() {
    return CONFIG.my_token.replaceAll(/\s/g, '')
}

function set_token(token) {
    let one_line_lenth = 'EF34F14CF8F7A00C9A01DB61234'.length;
    token = token.replaceAll(/\s/g, '');
    let start = 0;
    let end = start + one_line_lenth;
    let one_line = '';
    let result = [];
    do {
        one_line = token.slice(start, end);
        result.push(one_line);
        start = end;
        end = start + one_line_lenth;
    } while (start < token.length);
    CONFIG.my_token = result.join('\n');
}


async function follow_one(user_list) {
    if (!CONFIG.follow_enabled) {
        let timeout = CONFIG.follow_one_interval_second * 1000;
        setTimeout(function () {follow_one(user_list);}, timeout);
        return;
    }

    CONFIG.still_working = false;
    let user = user_list.pop();
    if (!user) {
        return;
    }
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
        CONFIG.still_working = true;
        let timeout = CONFIG.follow_one_interval_second * 1000;
        setTimeout(function () {follow_one(user_list);}, timeout);
    }


}

async function follow_batch(start_user, cursor) {
    if (!CONFIG.follow_enabled) {
        let timeout = CONFIG.follow_batch_interval_minutes * 60 * 1000;
        setTimeout(function () {follow_batch(start_user, cursor);}, timeout);
        return;
    }
    CONFIG.still_working = false;
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
        let followers_following_star = resp?.result?.aux?.uinf;
        let already_followed_by_me = resp?.result?.aux?.fws;
        if (followers_following_star) {
            let exception_list = already_followed_by_me ? already_followed_by_me : [];
            console.log(`already followed list ${exception_list}`);
            let task_list = [];
            for (let id in followers_following_star) {
                let user_info = followers_following_star[id];
                if (exception_list.indexOf(user_info['username']) < 0) {
                    task_list.push(user_info['username']);
                }
            }
            console.log(`task list ${task_list}`);
            await follow_one(task_list)
        }

        let cursor = resp?.result?.aux?.cursor;
        if (cursor) {
            CONFIG.still_working = true;
            let timeout = CONFIG.follow_batch_interval_minutes * 60 * 1000;
            setTimeout(function () {follow_batch(start_user, cursor);}, timeout);
            return cursor;
        }
    } else {
        console.log(`failed to get followers from ${start_user}`, resp)
    }
    return undefined;
}




async function follow_others() {
    let user_name = CONFIG.start_user;
    if (known_users.indexOf(user_name) >= 0) {
        return;
    }
    known_users.push(user_name);

    let cursor = undefined;
    let timeout_v = CONFIG.follow_batch_interval_minutes * 60 * 1000;

    setTimeout(function () {
        follow_batch(user_name, cursor)
    }, timeout_v);
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
                    if (key === 'my_token') {
                        set_token(request[key])
                    } else {
                        CONFIG[key] = request[key];
                    }
                    let resp = await chrome.storage.sync.set({CONFIG_GETTR: CONFIG});
                    console.log('save GETTR_CONFIG to cache done', resp);
                }
            }
        }
    } else {
        console.log(`background receive request:`, request);
    }
    sendResponse({...CONFIG, ...resp});
}


chrome.runtime.onMessage.addListener(msg_handler);


