//
const db = require('./lib/db');

async function verification_token(account, token) {
    //
    if (account == null) {
        console.warn('未发送account的请求');
        return Promise.resolve(false);
    }
    let {err, ret} = await db.get_user_token(account, token);
    if (err || ret == null || ret[0] == null || ret[0].token == null || ret[0].token != token) {
        return Promise.resolve(false);
    }
    return Promise.resolve(true);
    //
}

//
function getClientIP(req) {
    return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
        req.connection.remoteAddress || // 判断 connection 的远程 IP
        req.socket.remoteAddress || // 判断后端的 socket 的 
        req.connection.socket.remoteAddress;
}

module.exports = async function (ctx, next) {
    //ignore favicon
    if (ctx.path === '/favicon.ico' || ctx.path === '/') {
        ctx.body = '服务器正常运行';
        return;
    }
    //条件
    if (!ctx.request.url.includes('/login') && 
    !ctx.request.url.includes('/app') && 
    !ctx.request.url.includes('/export') && 
    !ctx.request.url.includes('/ht_mobile_info')&& 
    !ctx.request.url.includes('/most')) {
        if (await verification_token(ctx.request.headers['account'], ctx.request.headers['token'])) {
            //通过
        } else {			
			const address = getClientIP(ctx.req);
            console.warn('无效请求 来源', address, ctx.header['user-agent'], ctx.request.url);
            ctx.body = {code: 999, data: '会话过期 请重新登录'};
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
