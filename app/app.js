'use struct'
//
const SERVER_TYPE = process.argv.splice(2)[0];
//配置
const { webServiceConfig, sqlServiceConfig, log4jsConfig, setServerType } = require('./config/config');
setServerType(SERVER_TYPE);
//日志文件
const log4js = require('log4js');
let log4jsObject = log4jsConfig();
log4js.configure(log4jsObject);
const logger = log4js.getLogger('default');
log4jsObject.consoleLogChange(logger);
//
const l_t = Date.now();
console.log('服务器启动中……', SERVER_TYPE);
//koa web service
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const session = require('koa-session');
//用户自定义中间件
const middleWare = require('./middleware');
//数据库
const db = require('./mysql/mysql');
//COPY
const copy = require('./copy/copy');
//接收APP数据
const recv = require('./recv/recv');

const app = new Koa();
const router = Router();

app.keys = ['7E24107E2C629C2E83AA049F7CA1F173'];
const CONFIG = {
    key: 'koa:sess',            // 返给浏览器 cookie 的key 默认是 'kao:sess'
    maxAge: 7 * 86400000,       // cookie的过期时间 maxAge in ms (default is 1 days)
    autoCommit: true,           // (boolean) 自动给客户端下发cookie 并设置session
    overwrite: true,            // 是否可以覆盖之前同名的cookie    (默认default true)
    httpOnly: true,             // cookie是否只有服务器端可以访问 httpOnly or not (default true)
    signed: true,               // 签名默认true
    rolling: false,             // 在每次响应时强制设置session标识符cookie，到期时被重置设置过期倒计时。（默认为false）
    renew: false,               // 当session快过期时更新session，这样就可以始终保持用户登录 默认是false
};
app.use(session(CONFIG, app));

//跨域访问组件
app.use(cors());
//使用ctx.body解析中间件
app.use(bodyParser({
    jsonLimit: '8mb',
    formLimit: '8mb',
}));
//用户中间件
app.use(middleWare);
//路由组件
app.use(router.routes());
app.use(router.allowedMethods());

//登录后台和接收APP数据用 暂时揉在一起
recv.registerRoute(router);

//请求
app.on('error', (err, ctx) => {
    console.error('错误', ctx, err.stack);
});
app.listen(webServiceConfig[SERVER_TYPE].port);

//mysql service 启动
if (!db.init(sqlServiceConfig)) {
    console.error('数据库初始出错 请检查环境和配置');
    console.info('服务器启动失败');
    return;
}

//全局吃掉未处理异常
process.on('uncaughtException', function (err) {
    console.error('未捕获的异常: ' + err.stack);
});

//
console.info(copy[1]);
console.log('服务器启动完成[' + webServiceConfig[SERVER_TYPE].port + '], 耗时', Date.now() - l_t, 'ms');
//

