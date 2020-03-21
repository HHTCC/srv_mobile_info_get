//
exports.webServiceConfig = {
    host: {//后台
        port: 3223
    },                     //koa框架 无需配置host
    app: {//APP
        port: 3002,
    }
};
//
exports.sqlServiceConfig = {
    host: '127.0.0.1',              //数据库地址
    user: 'root',                   //登录用户名
    password: '123456',             //登录密码
    database: 'and_ios_web_data',   //数据库名
    port: 3306                      //数据库端口
};
//
let programName = 'server-';
exports.setServerType = function (type) {
    programName += type;
};

exports.log4jsConfig = function () {
    //您要写入日志文件的路径
    let filename = null;
    if(process.platform === 'linux'){
        filename = __dirname + `/../logs/${programName}`;
    }else{
        filename = __dirname + `\\..\\logs\\${programName}`;
    }
    console.log('日志路径', filename);

    return {
        appenders: {
            console: {//记录器1:输出到控制台
                type: 'console',
            },
            data_file: {//：记录器3：输出到日期文件
                type: "dateFile",
                filename: filename,//您要写入日志文件的路径
                alwaysIncludePattern: true,//（默认为false） - 将模式包含在当前日志文件的名称以及备份中
                daysToKeep: 30,//时间文件 保存多少天，距离当前天daysToKeep以前的log将被删除
                //compress : true,//（默认为false） - 在滚动期间压缩备份文件（备份文件将具有.gz扩展名）
                pattern: "yyyy-MM-dd.log",//（可选，默认为.yyyy-MM-dd） - 用于确定何时滚动日志的模式。格式:.yyyy-MM-dd-hh:mm:ss.log
                encoding: 'utf-8',//default "utf-8"，文件的编码
            },
        },
        categories: {
            default: { appenders: ['data_file', 'console'], level: 'debug' },//默认log类型，输出到控制台 log文件 log日期文件 且登记大于info即可
        },
        replaceConsole: true,              //是否替换console.log
        //上面的替换无效时调用此方法
        consoleLogChange(logger) {
            //
            for (let log of ['debug', 'log', 'info', 'warn', 'error', 'trace', 'fatal']) {
                console[log] = function () {
                    if (log == 'log') {
                        logger['info'].apply(logger, arguments);
                    } else {
                        logger[log].apply(logger, arguments);
                    }
                };
            }
        },
    }
};

/*
                type: 'dateFile',
                //文件名为= filename + pattern, 设置为alwaysIncludePattern：true
                filename: 'serverlog',
                pattern: '-yyyy-MM-dd.log',
                //包含模型
                alwaysIncludePattern: true,*/
