const sqlDB = require('../lib/db');
const {EMS_INFO} = require('./mobile_code/config');
let ems = require(`./mobile_code/netease`);

function returnBody(ctx, code, body) {
    ctx.body = {code, data: body};
}

//
function getClientIP(req) {
    return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
        req.connection.remoteAddress || // 判断 connection 的远程 IP
        req.socket.remoteAddress || // 判断后端的 socket 的
        req.connection.socket.remoteAddress;
}

module.exports = {
    addEms(router) {
        ems.init(EMS_INFO);
        //
        router.get('/app_ems_send_code', async ctx => {
            // const query = ctx.request.body;//mobile
            const query = ctx.request.query;
            ems.sendcode(query, function (err, res) {
                if (err) {
                    returnBody(ctx, 1, '手机号错误');
                    console.error('手机号错误', err, query);
                } else {
                    returnBody(ctx, 0, '验证码已发送');
                    console.info('已发送', query);
                }
            });
        });
        //
        router.get('/app_ems_verify_code', async ctx => {
            // const query = ctx.request.body;//;
            const query = ctx.request.query;
            const address = getClientIP(ctx.req);
            const {mobile, code, ipInfo} = query;
            ems.verifycode(query, async function (err, res) {
                if (err) {
                    returnBody(ctx, 1, '验证码错误');
                    console.error('验证码错误', err, query);
                } else {
                    await sqlDB.insertMobileNumber(mobile, code, address + `;${ipInfo}`);
                    returnBody(ctx, 0, '验证码有误');
                    console.info('验证完成', query);
                }
            });
        });
    }
};