const crypto = require('crypto');
const aes = require('./crypto/aes');

exports.md5 = function (content) {
    let md5 = crypto.createHash('md5');
    md5.update(content);
    return md5.digest('hex');
};

exports.sha1 = function (content) {
    let sha1 = crypto.createHash('sha1');
    sha1.update(content);
    return sha1.digest('hex');
};

exports.toBase64 = function (content) {
    return content;
    // return new Buffer(content).toString('base64');
};

exports.fromBase64 = function (content) {
    return content;
    // return new Buffer(content, 'base64').toString();
};


exports.AesEncrypt = aes.encrypt;
exports.AesDecrypt = aes.decrypt;
