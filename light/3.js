const crypto = require('crypto');
const cipher = crypto.createCipher('aes192', '12');

let encrypted = cipher.update('123', 'utf8', 'hex');
encrypted += cipher.final('hex');
console.log(encrypted);