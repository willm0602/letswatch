const conn = require('../../database/mySQLconnect')
const { apiResponse, getIDFromAccessToken, randomStr } = require('../../MiscUtils')
const {
    createSinglePersonGroup,
    getInfoForGroup,
} = require('./GroupController')
const { createList } = require('./WatchListController')

async function test(ctx) {
    return (ctx.body = 'Account Router is Stupid!!!')
}

/*
DB call to add a user to the database

Accessible through route at /account/signup

Parameters (passed through ctx)
    username: str
    password: str
*/
async function signup(ctx, next) {
    const params = ctx.request.query
    const defaultProfileImage = 0
    const defaultProfileBio = ''
    const username = params.username
    const password = params.password
    const joinDate = new Date()
    const accessTokenLen = 32

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
                    )`

    return new Promise(async (res, rej) => {
        const userExists = await usernameTaken(username)
        if (userExists) return rej('Error: User Already Exists')
        const execution = conn.query(
            {
                sql: query,
                values: [
                    username,
                    password,
                    defaultProfileImage,
                    defaultProfileBio,
                    randomStr(accessTokenLen),
                    joinDate,
                ],
            },
            async (err, tuples) => {
                if (err) {
                    ctx.body = apiResponse(false, err)
                    return rej(err)
                }
                const accessToken = await getAccessToken(username, password)
                if (accessToken !== undefined) {
                    const id = await getIDFromAccessToken(accessToken)
                    await createSinglePersonGroup(id)
                    ctx.body = apiResponse(true, accessToken)
                    return res('Succesfully signed up User!')
                }
                ctx.body = apiResponse(
                    false,
                    'Error getting access token for new user'
                )
                return rej('Error getting access token from new user')
            }
        )
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
async function login(ctx, next) {
    const queryParams = ctx.request.query
    const username = queryParams.username
    const password = queryParams.password
    console.log(username, password, '\n\n')

    const accessToken = await getAccessToken(username, password)
    console.log(`accessToken is`, accessToken)
    return new Promise((res, rej) => {
        if (accessToken !== undefined) {
            ctx.body = apiResponse(true, accessToken)
            return res('Succesfully logged in')
        }
        ctx.body = apiResponse(false, {})
        return rej('Failed to sign in')
    })
}

async function usernameTaken(username) {
    console.log('checking if username has been taken')
    const query = `SELECT Username FROM Users WHERE Username=?;`
    return new Promise((res, rej) => {
        conn.query(
            {
                sql: query,
                values: [username],
            },
            (err, tuples) => {
                console.log('got usernames', tuples)
                if (err) return rej(undefined)
                if (tuples.length === 0) {
                    return res(false)
                }
                return res(true)
            }
        )
    })
}

async function getAccessToken(username, password) {
    const query = `SELECT * FROM Users 
                        WHERE Username=?
                        AND User_Password=?;`

    return new Promise((res, rej) => {
        console.log('getting access token from database')
        const execution = conn.query(
            {
                sql: query,
                values: [username, password],
            },
            (err, tuples) => {
                console.log('got access tokens from database', tuples, err)
                if (err) return rej(undefined)
                if (tuples.length === 0) return res(undefined)
                return res(tuples[0].Access_Token)
            }
        )
    })
}

async function allGroupsForUser(id) {
    const sql = `SELECT * FROM user_group_memberships WHERE user_id=?`

    return new Promise((res, rej) => {
        conn.query(
            {
                sql,
                values: [id],
            },
            (err, rows) => {
                if (err) return rej(err)
                const uniqueGroupIDs = new Set()
                for (let row of rows) {
                    uniqueGroupIDs.add(row.group_id)
                }
                return res(uniqueGroupIDs)
            }
        )
    })
}

async function allInfo(ctx) {
    const accessToken = ctx.request.query.accessToken
    return new Promise(async (res, rej) => {
        if (!(accessToken || accessToken === 0)) {
            ctx.body = apiResponse(false, 'No ID provided')
            return rej('No user ID provided')
        }

        const sql = `SELECT * FROM Users WHERE Access_Token=?;`
        const query = conn.query(
            {
                sql: sql,
                values: [accessToken],
            },
            async (err, tuples) => {
                console.log(query.sql)
                if (err || !tuples) {
                    ctx.body = apiResponse(
                        false,
                        'Unable to get user from database'
                    )
                    return rej(ctx.body)
                }
                if (tuples.length === 0) {
                    ctx.body = apiResponse(
                        false,
                        "User doesn't exist in database"
                    )
                    return rej(ctx.body)
                }
                const userData = tuples[0]
                const groupIDs = Array.from(await allGroupsForUser(userData.id))
                let groups = []
                for (let groupID of groupIDs) {
                    const group = await getInfoForGroup(groupID)
                    groups.push(group)
                }

                console.log('groups is', groups)

                let userInfo = await {
                    id: userData.id,
                    username: userData.Username,
                    profileID: userData.ProfileImageID,
                    bio: userData.Bio,
                    accessToken: userData.Access_Token,
                    dateJoined: userData.Date_joined,
                    groups,
                }
                ctx.body = userInfo
                console.log('sending info for user')

                return res(userInfo)
            }
        )
    })
}

module.exports = {
    test,
    getAccessToken,
    signup,
    login,
    allInfo,
}
