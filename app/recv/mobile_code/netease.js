let crypto = require('./crypto');
let httpc = require('request');

let appkey;
let appsecret;
let verifycode_url;
let send_url;

function invitcode() {
    const chars = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let res = "";
    for (let i = 0; i < 8; i++) {
        let id = Math.ceil(Math.random() * 8);
        res += chars[id];
    }
    return res;
}

exports.init = function (configs) {
    appkey = configs.appkey || ""
    appsecret = configs.appsecret || ""
    verifycode_url = configs.verifycode_url || ""
    send_url = configs.send_url
}

exports.sendcode = function (content, next) {
    let postContent = {
        'mobile': content.mobile || "",
        'needUp': false
    }

    let curtime = parseInt(Date.now() / 100);
    let nonce = invitcode();
    let checksum = crypto.sha1(appsecret + nonce + curtime);
    let options = {
        method: 'post',
        url: send_url,
        form: postContent,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'charset': 'utf8',
            'AppKey': appkey,
            'CurTime': curtime,
            'CheckSum': checksum,
            'Nonce': nonce
        }
    };

    httpc(options, function (err, res, body) {
        if (err) {
            console.log("Error NetEase 0" + err);
            if (next) {
                next(err, res);
            }
        } else {
            try {
                let ret = JSON.parse(body);
                if (ret.code == 200) {
                    if (next) {
                        next(null, res);
                    }
                } else {
                    if (next) {
                        next("err code:" + ret.code, res);
                    }
                    console.log("Error NetEase 1" + body);
                }
            } catch (e) {
                if (next) {
                    next(e, res);
                }
            }
        }
    })
}

exports.verifycode = function (content, next) {

    let postContent = {
        'mobile': content.mobile || "",
        'code': content.code || ""
    }

    let curtime = parseInt(Date.now() / 100);
    let nonce = invitcode();
    let checksum = crypto.sha1(appsecret + nonce + curtime);
    let options = {
        method: 'post',
        url: verifycode_url,
        form: postContent,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'charset': 'utf8',
            'AppKey': appkey,
            'CurTime': curtime,
            'CheckSum': checksum,
            'Nonce': nonce
        }
    };


    httpc(options, function (err, res, body) {
        if (err) {
            console.log("Error NetEase 2:" + err);
            if (next) {
                next(err, res);
            }
        } else {
            try {
                let ret = JSON.parse(body);
                if (ret.code == 200) {
                    if (next) {
                        next(null, res);
                    }
                } else {
                    if (next) {
                        next("err code:" + ret.code, res);
                    }
                    console.log("Error NetEase 3:" + body);
                }
            } catch (e) {
                if (next) {
                    next(e, res);
                }
            }
        }
    })
}