let mysql = require('mysql');
let _poolModule = require('generic-pool');
/*
 * Create mysql connection pool.
 */
let createMysqlPool = function (opt) {

    let host = opt.host;
    let user = opt.user;
    let password = opt.password;
    let database = opt.database;
    let port = opt.port;

    let poolOpts = opt.pool || {}
    poolOpts.min = poolOpts.min || 2;
    poolOpts.max = poolOpts.max || 10;
    poolOpts.idleTimeoutMillis = poolOpts.idleTimeoutMillis || 30000;
    poolOpts.log = poolOpts.log || true;

    const factory = {
        create: function () {
            return new Promise(function (resolve) {
                let client = mysql.createConnection({
                    host: host,
                    user: user,
                    password: password,
                    database: database,
                    port: port
                });
                client.on('error', function () {
                    client.connect();
                });
                client.connect(function (error) {
                    if (error) {
                        console.log('mysql connect error', error);
                    }
                    resolve(client)
                });

                //此处可选择性屏蔽
                setInterval(()=>{
                    if(client == null || client.ping == null){
                        console.error('数据库心跳出错', client ? `0${client.ping}`: client)
                        return;
                    }
                    client.ping((err)=>{
                        if(err){
                            console.error('DB - 数据库心跳出错', err);
                        }
                        else{
                            //console.debug('DB - 数据库心跳正常');
                        }
                    });
                },1*60e3);
            })
        },
        destroy: function (client) {
            return new Promise(function (resolve) {
                client.on('end', function () {
                    resolve();
                })
                client.end()
            })
        }
    }
    return _poolModule.createPool(factory, poolOpts);
};
exports.createMysqlPool = createMysqlPool;
