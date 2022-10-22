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
async function signup(ctx, next)
{
    const params = ctx.request.query;
    console.log('making new user for', params);
    const defaultProfileImage = 0;
    const defaultProfileBio = '';
    const username = params.username;
    const password = params.password;
    const joinDate = new Date();
    const accessTokenLen = 32;

    const query = `INSERT INTO Users 
                    (
                        Username, 
                        User_Password, 
                        ProfileImageID, 
                        BIO,
                        ACCESS_TOKEN,
                        Date_joined
                    ) VALUES(
                        ?,
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
                randomStr(accessTokenLen),
                joinDate
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


/**
 * DB call to let users sign in 
 * 
 * Accessible through route at /account/login
 * 
 * Parameters (passed through ctx)
    username: str
    password: str

    Returns an access token
*/
async function login(ctx)
{
    const {username, password} = ctx.request.query;
    const accessToken = await getAccessToken(username, password);
    return new Promise((res, rej) => {
        if(accessToken !== undefined)
        {
            ctx.body = apiResponse(true, accessToken);
            return res('Succesfully logged in');
        }
        ctx.body = apiResponse(false, {});
        return rej('Failed to sign in');
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
                        AND User_Password=?;`
    
    return new Promise((res, rej) => {
        const execution = conn.query({
            sql: query,
            values: [
                username,
                password,
            ]
        }, (err, tuples) => {
            if(err || tuples.length == 0)
                return undefined;
            return res(tuples[0].Access_Token);
        })
    })
}


module.exports = {
    test,
    getAccessToken,
    signup,
    login
}