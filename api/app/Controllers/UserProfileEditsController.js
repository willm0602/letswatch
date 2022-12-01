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
    const {accessToken, bio} = queryParams;
    const updateQuery = `UPDATE Users SET Bio = ? WHERE access_token = ?;`;
    return new Promise(async (res,rej) => {
        conn.query(
            {
                sql: updateQuery,
                values: [bio,accessToken],
            },
            async (err, tuples) => {
                if (err) 
                {
                    ctx.body = apiResponse(false, 'unable to update bio')
                    return rej(ctx.body);
                }
                ctx.body = apiResponse(true, 'updated bio');
                return res(ctx.body);
            }
        )
    })
}

async function changeImage(ctx) {
    const queryParams = ctx.request.query;
    const {accessToken, image} = queryParams;
    const query = `UPDATE Users SET ProfileImageID = ? WHERE access_token = ?;`
    return new Promise((res, rej) => {
        conn.query(
            {
                sql: query,
                values: [image, accessToken],
            },
            async (err, tuples) => {
                if (err){
                    ctx.body = apiResponse(false, 'unable to update profile image')
                    return rej(ctx.body);
                } 
                ctx.body = apiResponse(true, 'updated profile image');
                return res(ctx.body);
            }
        )
    })
}

module.exports = {
    changeImage,
    changeBio
}