/**
 * Misc. utility functions 
 */

module.exports.randomStr = (strLen) => {
    const validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let result = '';
    for(let _ = 0; _ < strLen; _++)
    {
        result = result + 
        validChars.charAt(
            Math.floor(Math.random() * validChars.length)    
        );
        console.log(Math.floor(Math.random() * validChars.length));
    }
    return result;
}

module.exports.apiResponse = (statusPassed, data) => {
    return {
        status: statusPassed ? 'PASS' : 'FAIL',
        data
    }
}