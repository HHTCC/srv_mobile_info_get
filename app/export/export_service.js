const nodeExcel = require('excel-export');

function removeEmoji(content) {
    return content.replace(/\u0000|\u0001|\u0002|\u0003|\u0004|\u0005|\u0006|\u0007|\u0008|\u0009|\u000a|\u000b|\u000c|\u000d|\u000e|\u000f|\u0010|\u0011|\u0012|\u0013|\u0014|\u0015|\u0016|\u0017|\u0018|\u0019|\u001a|\u001b|\u001c|\u001d|\u001e|\u001f/g, "");
    //原文链接：https://blog.csdn.net/ISaiSai/article/details/53899026
    //return content.replace(/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g, "");
}

exports.getPhoneNumberResult = function (message, ctx) {
    if (message == null) return '此号没有信息或未授权';
    const filename = `message[${message._code}-${message.id}].xlsx`;
    let conf = {};
    conf.stylesXmlFile = __dirname + "\\styles.xml";
    conf.name = "mysheet";
    conf.cols = [{
        caption: '手机号',
        type: 'string',
    }, {
        caption: '昵称',
        type: 'string',
    }];
    conf.rows = [];
    let messageArray = JSON.parse(message._phone_numbers_json_array);
    let i = 0;
    for (let msg of messageArray) {

        conf.rows.push([String(msg.m), removeEmoji(String(msg.n))]);
    }
    let result = nodeExcel.execute(conf);
    //将数据转为二进制输出
    let data = Buffer.from(result, 'binary');
    ctx.set('Content-Type', 'application/vnd.openxmlformats;charset=utf-8');
    console.log('file name', filename);
    ctx.set("Content-Disposition", "attachment; filename=" + filename);
    return data;
}
exports.getMessageResult = function (message, ctx) {
    if (message == null) return '此号没有信息或未授权';
    const filename = `phone[${message._code}-${message.id}].xlsx`;
    let conf = {};
    conf.stylesXmlFile = __dirname + "\\styles.xml";
    conf.name = "mysheet";
    conf.cols = [{
        caption: '信息来源',
        type: 'string',
    }, {
        caption: '信息内容',
        type: 'string',
    }];
    conf.rows = [];
    let messageArray = JSON.parse(message._message_list_json_array);
    let i = 0;
    for (let msg of messageArray) {

        conf.rows.push([String(msg.m), removeEmoji(String(msg.t))]);
    }
    let result = nodeExcel.execute(conf);
    //将数据转为二进制输出
    let data = Buffer.from(result, 'binary');
    ctx.set('Content-Type', 'application/vnd.openxmlformats;charset=utf-8');
    console.log('file name', filename);
    ctx.set("Content-Disposition", "attachment; filename=" + filename);
    return data;
}

