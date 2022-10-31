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
async function login(ctx, next)
{
    const queryParams = ctx.request.query;
    const username = queryParams.username;
    const password = queryParams.password;
    console.log(username, password, '\n\n');

    const accessToken = await getAccessToken(username, password);
    console.log(`accessToken is`, accessToken);
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
        console.log('getting access token from database');
        const execution = conn.query({
            sql: query,
            values: [
                username,
                password,
            ]
        }, (err, tuples) => {
            console.log('got access tokens from database', tuples, err);
            if(err)
                return rej(undefined);
            if(tuples.length === 0)
                return res(undefined);
            return res(tuples[0].Access_Token);
        })
    })
}

async function getIDFromAccessToken(accessToken)
{
    const query = `SELECT * FROM Users 
                        WHERE Access_Token=?;`
    
    return new Promise((res, rej) => {
        console.log('checking access token from database');
        const execution = conn.query({
            sql: query,
            values: [
                accessToken
            ]
        }, (err, tuples) => {
            if(err)
                return rej(undefined);
            if(tuples.length === 0)
                return res(undefined);
            return res(tuples[0].id);
        })
    })
}

async function allInfo(ctx)
{
    console.log('all info is called');
    const userID = 2;
    return new Promise((res, rej) => {
        if(!(userID || userID === 0))
        {
            ctx.body = apiResponse(false, "No ID provided")
            return rej('No user ID provided');
        };

        const sql = `SELECT * FROM Users WHERE id=?`;
        conn.query({
            sql: sql,
            data: userID
        }, (err, tuples) => {
            if(err)
                ctx.body = apiResponse(false, "Unable to get user from database")
            if(tuples.length === 0)
                ctx.body = apiResponse(false, "User doesn't exist in database")
            const userTuples = tuples[0];
            ctx.body = userTuples;
            return res(userTuples);
        })
    })
}


module.exports = {
    test,
    getAccessToken,
    signup,
    login,
    getIDFromAccessToken,
    allInfo
}