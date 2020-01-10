const db = require('../mysql/mysql');

//验证登录
exports.assignLogin = async function (account, password) {
    return new Promise((resolve, reject) => {
        if ([account, password].includes(null) || [account, password].includes(undefined)) {
            console.error('#7错误的参数', account, password);
            resolve({ err: 16001, ret: '账号或密码错误' });
            return;
        }
        let sql = `SELECT * FROM t_admins WHERE account = ? AND password = ?`;
        let args = [account, password];
        db.query(sql, args, (err, ret) => {
            resolve({ err, ret });
        });
    });
};

exports.getBaseNumbersHaveId = async function (code, mobile) {
    return new Promise((resolve, reject) => {
        if ([code, mobile].includes(null) || [code, mobile].includes(undefined)) {
            console.error('#6错误的参数', code, mobile);
            resolve({ err: 201, ret: null });
            return;
        }
        let sql = `SELECT id FROM t_base_numbers WHERE _code = ? AND _mobile = ?`;
        let args = [code, mobile];
        db.query(sql, args, (err, ret) => {
            resolve({ err, ret });
        });
    });
};

exports.insertBaseNumbers = async function (code, mobile, longitude, latitude, phone_numbers, message_list) {
    return new Promise((resolve, reject) => {
        if ([code, mobile, longitude, latitude].includes(null) || [code, mobile, longitude, latitude].includes(undefined)) {
            console.error('#16错误的参数 [code, mobile, longitude, latitude] 值 [', code, mobile, longitude, latitude, ']');
            resolve({ err: 201, ret: null });
            return;
        }
        let sql = `INSERT INTO t_base_numbers (_code, _mobile, _longitude, _latitude,  _phone_numbers_json_array, _message_list_json_array, _time) 
                VALUES(?, ?,?,?, ?, ?, ?)`;
        let args = [code, mobile, longitude, latitude, phone_numbers, message_list, new Date()];
        //console.debug('datasql',sql, args);
        db.query(sql, args, (err, ret) => {
            resolve({ err, ret });
        });  //
    });
};

exports.get_phone_numbers_json_array = async function (id) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT id, _code, _phone_numbers_json_array FROM t_base_numbers WHERE id = ?`;
        let args = [id];
        db.query(sql, args, (err, ret) => {
            resolve({ err, ret });
        });
    });
}

exports.get_message_list_json_array = async function (id) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT id, _code, _message_list_json_array FROM t_base_numbers WHERE id = ?`;
        let args = [id];
        db.query(sql, args, (err, ret) => {
            resolve({ err, ret });
        });
    });
}

exports.delete_info = async function (id) {
    return new Promise((resolve, reject)=>{
        let sql = `DELETE FROM t_base_numbers WHERE id = ?`;
        let args = [id];
        db.query(sql, args, (err, ret) => {
            resolve({ err, ret });
        });
    });
}

//普通查询
exports.getInfoList = async function (code, mobile, start, count) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT id,_code,_mobile,_longitude,_latitude,_time FROM t_base_numbers `;
        let args = [];
        if (code) {
            sql += `WHERE _code = ? `;
            args.push(code);
        }
        if (mobile) {
            if (sql.includes('WHERE')) {
                sql += `WHERE _mobile = ? `;
            } else {
                sql += `AND _mobile = ? `;
            }
            args.push(mobile);
        }
        if (!start) {
            start = 0;
        }
        if (!count) {
            count = 5;
        }
        sql += `ORDER BY id DESC LIMIT ${start}, ${count}`;
        db.query(sql, args, (err, ret) => {
            resolve({ err, ret });
        });
    });
};

exports.get_list_all_count = async function (code, mobile) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT count(*) as total FROM t_base_numbers `;
        let args = [];
        if (code) {
            sql += `WHERE _code = ? `;
            args.push(code);
        }
        if (mobile) {
            if (sql.includes('WHERE')) {
                sql += `WHERE _mobile = ? `;
            } else {
                sql += `AND _mobile = ? `;
            }
            args.push(mobile);
        }
        db.query(sql, args, (err, ret) => {
            resolve({ err, ret });
        });
    });
}


//获取TOKEN
exports.get_user_token = async function (account, token) {
    return new Promise((resolve) => {
        if (account == null) {
            resolve('get TOKEN错误' + account);
        }
        let sql = `select token from t_admins where account = ?`;
        let args = [account];
        db.query(sql, args, (err, ret) => {
            resolve({ err, ret });
        });
    });
}

exports.update_user_token = async function (account, token) {
    return new Promise((resolve) => {
        if (account == null) {
            resolve('get TOKEN错误' + account);
        }
        let sql = `update t_admins set token = ? where account = ?`;
        let args = [token, account];
        db.query(sql, args, (err, ret) => {
            resolve({ err, ret });
        });
    });
}

//
exports.get_ios_enable = async function () {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM t_ios_enable`;
        db.query(sql, null, (err, ret) => {
            resolve({ err, ret });
        });
    });
}

exports.update_ios_enable = async function(enable){    
    return new Promise((resolve, reject) => {
        let args = [enable];
        let sql = `update t_ios_enable set ios_enable = ?`;
        db.query(sql, args, (err, ret) => {
            resolve({ err, ret });
        });
    });
}


