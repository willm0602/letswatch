const conn = require('../../database/mySQLconnect');
const {
    apiResponse,
    getIDFromAccessToken,
} = require('../../MiscUtils');
const AccountController = require('./AccountController');

/**
 * DB calls to change users bio
 * 
 * accesible through /edit/bio
 * 
 * Parameters:  
 *  userID: int
 *  bio: str
 * 
 *  returns result
 */

async function changeBio(ctx) {
    const queryParams = ctx.request.query;
    const {userID, bio} = queryParams;
    const updateQuery = `UPDATE Users SET Bio = ? WHERE id=?;`;
    return new Promise(async (res,rej) => {
        conn.query(
            {
                sql: updateQuery,
                values: [bio,userID],
            },
            async (err, tuples) => {
                if (err) return rej('Unable to update bio. Sadge :(')
                return res('Updated bio')
            }
        )
    })
}

async function changeImage(ctx) {
    const queryParams = ctx.request.query;
    const {userID, image} = queryParams;
    const query = `UPDATE Users SET ProfileImageID = ? WHERE id = ?;`
    return new Promise((res, rej) => {
        conn.query(
            {
                sql: query,
                values: [image, userID],
            },
            async (err, tuples) => {
                if (err) return rej('Unable to update profile image')
                return res('Updated profile image')
            }
        )
    })
}

module.exports = {
    changeImage,
    changeBio
}