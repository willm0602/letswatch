const conn = require("../../database/mySQLconnect");
const {apiResponse, randomStr} = require('../../MiscUtils');

async function test(ctx)
{
    return ctx.body = 'Account Router is working!'
}

/*
DB call to add a user to the database

Accessible through route at /account/signup

Parameters (passed through ctx)
    username: str
    password: str
*/
async function signup(ctx)
{
    const defaultProfileImage = 0;
    const defaultProfileBio = '';
    const username = ctx.headers.username;
    const password = ctx.headers.password;
    const joinDate = new Date();
    const accessTokenLen = 32;

    const query = `INSERT INTO Users 
                    (
                        Username, 
                        Password, 
                        ProfileImageID, 
                        BIO,
                        ACCESS_TOKEN
                    ) VALUES(
                        ?,
                        ?,
                        ?,
                        ?,
                        ?
                    )`;
    
    return new Promise(async (res, rej) => {
        const userExists = await usernameTaken(username);
        if(userExists)
            return rej('Error: User Already Exists');
        const execution = conn.query({
            sql: query,
            values: [
                username,
                password,
                defaultProfileImage,
                defaultProfileBio,
                randomStr(accessTokenLen)
            ]
        }, async (err, tuples) => {
            if(err)
            {
                ctx.body = apiResponse(false, err)
                return rej(err);
            }
            const accessToken = await getAccessToken(username, password);
            if(accessToken !== undefined)
            {
                ctx.body = apiResponse(true, accessToken);
                return res('Succesfully signed up User!');
            }
            ctx.body = apiResponse(false, 'Error getting access token for new user')
            return rej('Error getting access token from new user');
        })
    })
}

async function usernameTaken(username)
{
    console.log('checking if username has been taken')
    const query = `SELECT Username FROM Users WHERE Username=?;`
    return new Promise((res, rej) => {
        conn.query({
            sql: query,
            values: [username]
        }, (err, tuples) => {
            console.log('got usernames', tuples);
            if(err)
                return rej(undefined);
            if(tuples.length === 0)
            {
                return res(false);
            }
            return res(true);
        })
    })
}

async function getAccessToken(username, password)
{
    const query = `SELECT * FROM Users 
                        WHERE Username=?
                        AND Password=?;`
    
    return new Promise((res, rej) => {
        const execution = conn.query({
            sql: query,
            values: [
                username,
                password,
            ]
        }, (err, tuples) => {
            if(err)
                return undefined;
            return res(tuples[0].Access_Token);
        })
    })
}


module.exports = {
    test,
    getAccessToken,
    signup
}