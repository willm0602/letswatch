const conn = require('../../database/mySQLconnect')
const {
    apiResponse,
    getIDFromAccessToken,
    randomStr,
} = require('../../MiscUtils')
const {
    createSinglePersonGroup,
    getInfoForGroup,
} = require('./GroupController')

const { createList } = require('./WatchListController')

/*
DB call to add a user to the database

Accessible through route at /account/signup

Parameters (passed through ctx)
    username: str
    password: str
*/
async function signup(ctx, next) {
    const params = ctx.request.query
    const defaultProfileImage = undefined
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

/**
 * Checks if a username is available
 *
 * Parameters
 *  username: str
 *
 * Returns true if the username has been taken, false if the username
 * hasn't been taken and undefined if there is an error querying the database
 */
async function usernameTaken(username) {
    const query = `SELECT Username FROM Users WHERE Username=?;`
    return new Promise((res, rej) => {
        conn.query(
            {
                sql: query,
                values: [username],
            },
            (err, tuples) => {
                if (err) return rej(`Unable to query database`)
                if (tuples.length === 0) {
                    return res(false)
                }
                return res(true)
            }
        )
    })
}

/**
 * Gets an access token for a user with a given username and password
 *
 * Parameters
 * ---------
 * username: str
 *
 * password: str
 *
 * returns the access token for the user if it is valid, otherwise returns undefined
 */
async function getAccessToken(username, password) {
    const query = `SELECT * FROM Users 
                        WHERE Username=?
                        AND User_Password=?;`

    return new Promise((res, rej) => {
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

/**
 * Gets a list of ids of groups that a user is in
 *
 * Parameters
 * ---------
 * id: int
 *      the id of the user that we are getting the groups for
 *
 * returns the ids of each group that the user is in
 */
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

/**
 * DB call to get all information a user might need 
 * 
 * Accessible through route at /account/info
 * 
 * Parameters (passed through ctx)
    ---------------------------
    accessToken: str
        accessToken of the user that we are getting the information for

    Returns an object with the following structure:
    {
    "id",
    "username",
    "profileID",
    "bio",
    "accessToken",
    "dateJoined",
    "groups": [
        {
            "groupID": 13,
            "groupName": "23-sologroup",
            "members": [
                {
                    "username",
                    "profileID",
                    "id"
                }...
            ],
            "lists": [
                {
                    "listName",
                    "listID",
                    "listMembers": [
                        {
                            "username",
                            "profileID"
                        }...
                    ],
                    "media": [
                        {
                            "title",
                            "poster",
                            "synopsis",
                            "score",
                            "addedBy",
                        }
                    ]
                }...     
            ]
        }
    ]
}
*/
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

async function addFriend(ctx) {
    const { accessToken, userID } = ctx.request.query
    const requestUserID = await getIDFromAccessToken(accessToken)

    const sql = `INSERT INTO friendships (
                    first_user_id, 
                    second_user_id
                ) VALUES(
                    ?,
                    ?
                )`

    return new Promise((res, rej) => {
        conn.query(
            {
                sql,
                values: [requestUserID, userID],
            },
            (err, rows) => {
                if (err) {
                    ctx.body = apiResponse(
                        false,
                        `Error adding friends ${userID} ${requestUserID}`
                    )
                    return rej(ctx.body)
                }
                ctx.body = 'Succesfully added friends'
                return res(ctx.body)
            }
        )
    })
}

async function getAllUsers() {
    const sql = `SELECT * FROM users;`

    return new Promise((res, rej) => {
        conn.query(
            {
                sql,
            },
            (err, rows) => {
                if (err) return rej(err)
                return res(rows)
            }
        )
    })
}

async function allFriends(ctx) {
    const { accessToken } = ctx.request.query
    console.log('accessToken is', accessToken)
    const requesterID = await getIDFromAccessToken(accessToken)
    console.log(`requestion all friends for user ${requesterID}`)
    const allUsers = await getAllUsers()
    let friends = []

    return new Promise(async (res, rej) => {
        for (const user of allUsers) {
            const areFriends = await checkAreFriends(requesterID, user.id)
            if (areFriends)
                friends.push({
                    id: user.id,
                    username: user.Username,
                    profileImageID: user.ProfileImageID,
                    bio: user.Bio,
                    dateJoined: user.Date_joined,
                })
        }
        ctx.body = friends
        return res(friends)
    })
}

async function checkAreFriends(firstUserID, secondUserID) {
    const sql = `SELECT * FROM friendships WHERE (
                    (first_user_id=? AND second_user_id=?) OR
                    (first_user_id=? AND second_user_id=?)
                )`
    return new Promise((res, rej) => {
        conn.query(
            {
                sql,
                values: [firstUserID, secondUserID, secondUserID, firstUserID],
            },
            (err, rows) => {
                if (err) return rej(err)
                if (rows.length === 0) return res(false)
                return res(true)
            }
        )
    })
}

async function addFriendToGroup(ctx) {
    const { accessToken, groupID, friendID } = ctx.request.query
    const requesterID = await getIDFromAccessToken(accessToken)

    const tryingToAddFriend = requesterID
        ? await checkAreFriends(requesterID, friendID)
        : undefined
    const requestersGroupsSet = requesterID
        ? await allGroupsForUser(requesterID)
        : undefined
    const requestersGroups = requestersGroupsSet
        ? Array.from(requestersGroupsSet)
        : undefined
    const requesterWasInGroup = requestersGroups
        ? requestersGroups.filter((group) => {
              return group == groupID
          }).length > 0
        : undefined

    return new Promise((res, rej) => {
        if(!(tryingToAddFriend && requesterWasInGroup)){
            ctx.body = apiResponse(false, 'invalid response');
            return rej('invalid args');
        };
        const sql = `INSERT INTO user_group_memberships (user_id, group_id)
                                    VALUES(?, ?)`;

        conn.query({
            sql,
            values: [friendID, groupID]
        }, (err, rows) => {
            console.log(err, rows);
            if(err)
            {
                ctx.body = apiResponse(false, err);
                return rej(err);
            }
            ctx.body = apiResponse(true, 'Added friend to database');
            return res('Added friend to database')
        })
    })
}

module.exports = {
    getAccessToken,
    signup,
    login,
    allInfo,
    addFriend,
    allFriends,
    addFriendToGroup,
}
