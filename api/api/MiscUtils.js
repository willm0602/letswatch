/**
 * Misc. utility functions 
 */

const crypto = require('crypto');

module.exports.randomStr = (strLen) => {
    const validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let result = '';
    for(let _ = 0; _ < strLen; _++)
    {
        result = result + 
        validChars.charAt(
            Math.floor(Math.random() * validChars.length)    
        );
    }
    return result;
}

module.exports.apiResponse = (statusPassed, data) => {
    return {
        status: statusPassed ? 'PASS' : 'FAIL',
        data
    }
}


/*
    Putting on hold for now, trying to get encrypting and decrypting strings setup
    For storing passwords in the db
*/
module.exports.encrypt = (phrase) => {
    const cipher = crypto.createCipher('aes-192-gcm', process.env.JWT_KEY);
    let encrypted = cipher.update(phrase, 'utf8', 'hex');
    encrypted+=cipher.final('hex');
    return encrypted;
}

module.exports.decrypt = (phrase) => {
    const cipher = crypto.createDecipher('aes-192-gcm', process.env.JWT_KEY);
    let decrypted = cipher.update(phrase, 'utf8', 'hex');
    decrypted+=cipher.final('hex');
    return decrypted;
}