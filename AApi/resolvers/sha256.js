const crypto = require('crypto');
const secret = 'f$@#duc!aCH@!n&**@#^%';
const algorithm = 'sha256';

exports.getHash = function (text) {
    const hash = crypto.createHmac(algorithm, secret)
        .update(text)
        .digest('hex');
    return hash;
}