const conn = require("../../database/mySQLconnect");
const AccountController = require('./AccountController');

async function createSinglePersonGroup(userID)
{
    const query = `INSERT INTO user_groups(
                                'Name'
                                ) 
                            VALUES(
                                ?
                            )`;
    const groupName = `${userID}-sologroup`;
    return new Promise(async (res, rej) => {
        conn.query({
            sql: query,
            values: [groupName]
        }, async (err, tuples) => {
            if(err)
                return rej('Unable to make group');
            
        })
    })
}

async function getUserGroupID(userID)
{
    const query = `SELECT * FROM user_groups WHERE Name=?;`;
    return new Promise((res, rej) => {
        conn.query({
            sql: query,
            values: [`${userID}-sologroup`]
        }, async (err, tuples) => {
            if(err)
                return rej('Unable to get group');
            if(tuples.length === 0)
                return rej('User does not have group');
            return res(tuples[0].id);
        })
    })
}

module.exports = {
    createSinglePersonGroup,
    getUserGroupID
}