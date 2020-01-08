//
const db = require('./db/db');
async function verification_token(account, token) {
    //
    return new Promise(async (resolve) => {
        if (account == null) {
            console.warn('未发送account的请求');
            return resolve(false);
        }
        let { err, ret } = await db.get_user_token(account, token);
        if (err || ret == null || ret[0] == null || ret[0].token == null || ret[0].token != token) {
            return resolve(false);
        }
        resolve(true);
    });
    //
}
module.exports = async function (ctx, next) {
    //ignore favicon
    if (ctx.path === '/favicon.ico' || ctx.path === '/') {
        ctx.body = '服务器正常运行';
        return;
    }
    //条件
    if (!ctx.request.url.includes('/login') && !ctx.request.url.includes('/app') && !ctx.request.url.includes('/export')) {
        if (await verification_token(ctx.request.headers['account'], ctx.request.headers['token'])) {
            //通过
        }
        else {
            console.warn('无效请求');
            ctx.body = { code: 999, data: '会话过期 请重新登录' };
            return;
        }
    }
    //
    let str = ctx.request.url;
    console.debug('响应', str);
    let d = Date.now();
    await next();
    console.debug('响应', str, '耗时:', Date.now() - d, '毫秒');
};
