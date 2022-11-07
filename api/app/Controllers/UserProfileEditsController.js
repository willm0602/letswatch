const conn = require('../../database/mySQLconnect')
const {
    apiResponse,
    getIDFromAccessToken,
} = require('../../MiscUtils')

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

async function changeBio(userID, bio) {
    const query = `UPDATE Users SET Bio = '?' WHERE id=?;`
    return new Promise((res,rej) => {
        conn.query(
            {
                sql: query,
                values: [bio,userID],
            },
            async (err, tuples) => {
                if (err) return rej('Unable to update bio')
                return res('Updated bio')
            }
        )
    })
}