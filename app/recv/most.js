const sqlDB = require('../lib/db');

function returnBody(ctx, code, body) {
    ctx.body = { code, data: body };
}
const htUrl = 'http://43.248.201.75:3020';

module.exports = {
    addMost(router){
        //
        router.post('/most_get_url', async ctx => {
            returnBody(ctx, 0, {url:htUrl});
        });
        //
        router.post('/most_add_info', async ctx =>{
            let query = ctx.request.body;
            const {mostInfo} = query;
            console.log('most', mostInfo);
            let {err, ret} = await sqlDB.addMostInfo(mostInfo);
            if(err){
                console.error('错误most', err);
                returnBody(ctx, 1, 'Error');
                return;
            }else{
                console.info('most OK');
            }
            returnBody(ctx, 0, 'ok')
        });
    }
};