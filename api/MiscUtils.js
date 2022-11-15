/**
 * Misc. utility functions
 */

const conn = require('./database/mySQLconnect')
const crypto = require('crypto')

module.exports.randomStr = (strLen) => {
    const validChars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'
    let result = ''
    for (let _ = 0; _ < strLen; _++) {
        result =
            result +
            validChars.charAt(Math.floor(Math.random() * validChars.length))
    }
    return result
}

module.exports.apiResponse = (statusPassed, data) => {
    return {
        status: statusPassed ? 'PASS' : 'FAIL',
        data,
    }
}

/*
    Putting on hold for now, trying to get encrypting and decrypting strings setup
    For storing passwords in the db
*/
module.exports.encrypt = (phrase) => {
    const cipher = crypto.createCipher('aes-192-gcm', process.env.JWT_KEY)
    let encrypted = cipher.update(phrase, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return encrypted
}

module.exports.decrypt = (phrase) => {
    const cipher = crypto.createDecipher('aes-192-gcm', process.env.JWT_KEY)
    let decrypted = cipher.update(phrase, 'utf8', 'hex')
    decrypted += cipher.final('hex')
    return decrypted
}

// API utilities
module.exports.getIDFromAccessToken = async (accessToken) => {
    const query = `SELECT * FROM Users 
                        WHERE Access_Token=?;`

    return new Promise((res, rej) => {
        console.log('checking access token from database')
        const execution = conn.query(
            {
                sql: query,
                values: [accessToken],
            },
            (err, tuples) => {
                console.log('got rows', tuples);
                console.log(execution.sql);
                if (err) return rej(undefined)
                if (tuples.length === 0) return res(undefined)
                return res(tuples[0].id)
            }
        )
    })
}

module.exports.userIsInGroup = async (accessToken, groupID, id = undefined) => {
    const userID =
        accessToken !== undefined
            ? await this.getIDFromAccessToken(accessToken)
            : id
    const sql = `SELECT * FROM user_group_memberships WHERE user_id=? and group_id=?`

    return new Promise((res, rej) => {
        if (userID === undefined) return rej(`user ${userID} does not exist`)
        conn.query(
            {
                sql,
                values: [userID, groupID],
            },
            (err, rows) => {
                console.log(err, rows)
                if (err) return rej(err)
                if (rows.length > 0) return res(rows[0].id)
                return res(false)
            }
        )
    })
}
