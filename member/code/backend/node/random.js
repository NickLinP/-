function randomPassowrd() {
    var crypto = require('crypto');
    var buf = crypto.randomBytes(32);

    var result = buf.toString('base64').substr(0, 8);
    console.log(result);
    return result;
}

module.exports = randomPassowrd;