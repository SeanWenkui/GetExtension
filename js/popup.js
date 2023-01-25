const changeable_keys = [
    'follow_enabled',
    'my_user_name',
    'my_token',
    'start_user',
    'follow_batch_size',
    'follow_one_interval_second',
    'follow_batch_interval_minutes',
];

const bool_keys = [
    'follow_enabled',
    'follow_limit_hit',
    'still_working',
];

const number_keys = [
    'follow_batch_size',
    'follow_one_interval_second',
    'follow_batch_interval_minutes',
];

const CONFIG_BKUP = {};

function update_table(config) {

    for (let key in config) {
        if (changeable_keys.indexOf(key) >= 0) {
            continue;
        }
        let query_filter = `#${key}`;
        let val = config[key];
        if ($(query_filter).length > 0) {
            $(query_filter).html(`${val}`);
        }
    }

}

function handshake_to_background() {
    chrome.runtime.sendMessage({cmd: 'GET_CONFIG'}, update_table);
}

function init(config) {
    console.log('start initialize popup UI');
    Object.assign(CONFIG_BKUP, config);
    let data_pk = 0;
    for (let key in CONFIG_BKUP) {
        data_pk++;
        let value = CONFIG_BKUP[key];
        //console.log('key', key, value)
        let inner;
        if (changeable_keys.indexOf(key) >= 0) {
            let input_type = (key === 'my_token' ? 'textarea' : 'text')
            inner = `<a href="#" id="${key}" data-type="${input_type}" data-pk="${data_pk}">${value}</a>`;
            $(`#${key}_container`).html(inner);

            $.fn.editable.defaults.mode = 'inline';
            $(`#${key}`).editable({
                showbuttons: true,
                type: input_type,
                pk: data_pk,
                success: function (response, new_val) {
                    let new_value = `${new_val}`;
                    if (number_keys.indexOf(key) >= 0) {
                        new_value = parseInt(new_value);
                    } else if (bool_keys.indexOf(key) >= 0) {
                        new_value = (['false', 'False', 'F', '0'].indexOf(new_value) < 0);
                    }
                    if (new_value !== CONFIG_BKUP[key]) {
                        CONFIG_BKUP[key] = new_value;
                        chrome.runtime.sendMessage({cmd: 'SET_CONFIG', ...CONFIG_BKUP}, update_table);
                    }
               }
            });
        } else {
            $(`#${key}`).html(value);
        }
    }
}

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    console.log(tabs[0]);
    let url = tabs[0].url;
    if (url.indexOf("?") >= 0) {
        url = url.substring(0, url.indexOf("?"));
    }
    console.log("Tab url: " + url);
    setTimeout(function () {
        chrome.runtime.sendMessage({cmd: 'GET_CONFIG'}, init);
    }, 1000);

    setInterval(handshake_to_background, 5000)
});
