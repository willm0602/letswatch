const conn = require('../../database/mySQLconnect')
const {
    apiResponse,
    getIDFromAccessToken,
    randomStr,
    getIDFromUsername,
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


/**
 * API Call to send a friend request to a user
 * This will default to accepted = 0 since it shouldn't be accepted by default
 * 
 * Parameters (passeed through query parameters)
 * -------------
 * accessToken: str
 *      access token for the user requesting to add another user as a friend
 * 
 * potentialFriendUsername: str
 *      username of user that the friend request is being sent to     
 */ 
async function addFriend(ctx) {
    const { accessToken, potentialFriendUsername } = ctx.request.query
    const requestUserID = await getIDFromAccessToken(accessToken)

    const userID = await getIDFromUsername(potentialFriendUsername);

    const sql = `INSERT INTO friendships (
                    first_user_id, 
                    second_user_id
                ) VALUES(
                    ?,
                    ?
                )`

    return new Promise((res, rej) => {
        if (userID === undefined) {
            ctx.body = apiResponse(false, `no user with username ${potentialFriendUsername} exists`);
            return rej(ctx.body);
        }
        conn.query(
            {
                sql,
                values: [requestUserID, userID],
            },
            (err, rows) => {
                if (err) {
                    ctx.body = apiResponse(
                        false,
                        `Error adding friends ${userID} ${requestUserID} ${err}`
                    )
                    return rej(ctx.body)
                }
                ctx.body = 'Succesfully added friends'
                return res(ctx.body)
            }
        )
    })
}

/**
 * Utility function to get all users
 * 
 * Returns all information from the users table of the database
*/
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


/**
 * API call to get all the friends that a user has
 * 
 * Parameters (passed through query parameters)
 * ------------
 * accessToken: str
 *      access token of user requesting to get all of their friends
 * 
 */  
async function allFriends(ctx) {
    const { accessToken } = ctx.request.query
    const requesterID = await getIDFromAccessToken(accessToken)
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


/**
 * Utility function to see if two users are friends
 * NOTE: the order doesn't matter here
 * 
 * Parameters
 * ----------
 * firstUserID: int
 *      id of one of the users that we are seeing is friends with the other
 * secondUserID: int
 *      id of the other user that we are checking if is friends with the first
 * 
 */ 
async function checkAreFriends(firstUserID, secondUserID) {
    console.log(firstUserID, secondUserID);
    const sql = `SELECT * FROM friendships WHERE (
                    (first_user_id=? AND second_user_id=?) OR
                    (first_user_id=? AND second_user_id=?)
                ) AND accepted=1`
    return new Promise((res, rej) => {
        const exec = conn.query(
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


/**
 * API call for a user to add their friend to a group
 * 
 * Parameters (passed through query parameters)
 * -----------------------------------------------
 * accessToken: str
 *      access token for the user adding their friend to a group
 * groupID: int
 *      id of the group that the user is trying to add their friend to
 * friendID: int
 *      id of the friend that is being added to the group
*/ 
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
        if (!(tryingToAddFriend && requesterWasInGroup)) {
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
            if (err) {
                ctx.body = apiResponse(false, err);
                return rej(err);
            }
            ctx.body = apiResponse(true, 'Added friend to database');
            return res('Added friend to database')
        })
    })
}


/**
 * API call to let a user confirm a friend request
 * 
 * Parameters (passed through query parameters)
 * -------------------------------------------
 * accessToken: string
 *      access token for the user making the request
 * requesterID: int
 *      the id of the user that sent the friend request that the user is accepting
 */ 
async function confirmFriendRequest(ctx) {
    const sql = `UPDATE friendships SET accepted=1 WHERE first_user_id=? AND second_user_id=?`;
    const { accessToken, requesterID } = ctx.request.query;
    return new Promise(async (res, rej) => {
        const receiverID = await getIDFromAccessToken(accessToken);
        if (!(requesterID && receiverID)) {
            ctx.body = apiResponse(false, 'missing args');
            return rej(ctx.body);
        }
        conn.query({
            sql,
            values: [requesterID, receiverID]
        }, (err, rows) => {
            if (err) {
                ctx.body = apiResponse(false, err);
                return rej(ctx.body);
            }
            ctx.body = apiResponse(true, 'confirmed friend request');
            return res(ctx.body);
        })

    })
}


/**
 * API call to get all pending friend requests that a user has
 * 
 * Parameters (passed through query parameters)
 * ---------------------------------------------
 * accessToken: string
 *      the access token of the user requesting all their friend requests
*/   
async function getAllFriendRequests(ctx) {
    const { accessToken } = ctx.request.query;
    const sql = `SELECT first_user_id as id, Username, ProfileImageID, Bio, Date_joined FROM friendships 
	RIGHT JOIN users ON users.id=friendships.first_user_id
    WHERE second_user_id=? AND accepted=0;
                `;
    return new Promise(async (res, rej) => {
        const userID = await getIDFromAccessToken(accessToken);
        return conn.query({
            sql,
            values: [userID]
        }, (err, rows) => {
            if (err) {
                ctx.body = apiResponse(false, err);
                return rej(ctx.body);
            }
            ctx.body = rows;
            return res(ctx.body)
        })
    })
}



/**
 * API Call that lets a user deny a friend request from another user
 * 
 * Parameters (passed through query)
 * ------------------------------------
 * deniedUserUsername: string
 *      the username of the user whose friend request is being denied
 * 
 * accessToken: string
 *      the access token of the user denying the friend request
 */   
async function denyFriendRequest(ctx) {
    const { deniedUserUsername, accessToken } = ctx.request.query;
    const deniedUserID = await getIDFromUsername(deniedUserUsername);
    const denierUserID = await getIDFromAccessToken(accessToken);
    const sql = `DELETE FROM friendships WHERE first_user_id = ? AND second_user_id = ?`;

    return new Promise((rej, res) => {
        if ((!deniedUserID) || (!denierUserID)) {
            ctx.body = `Error: deniedID is ${deniedUserID} denierID is ${denierUserID}`
            return rej(`missing denier user id or denied user id`);
        }

        return conn.query({
            sql,
            values: [deniedUserID, denierUserID]
        }, (err, rows) => {
            if(err)
            {
                ctx.body = err;
                return rej(err);
            }
            ctx.body = apiResponse(true, 'removed friend response');
            return res(ctx.body);
        })
    })
}

/**
 * API call to get all the information of a friend
 * 
 * Parameters (passed through query parameters)
 * --------------------------------------------
 * accessToken: string
 *      the access token of the user requesting information for their friend
 * 
 * friendID: int
 *      the id of the friend that the user is requesting information for 
*/
async function getFriendInfo(ctx) {
    const {accessToken, friendID} = ctx.request.query;
    const requesterID = await getIDFromAccessToken(accessToken);
    const areFriends = requesterID ? await checkAreFriends(requesterID, friendID) : false;
    const sql = `SELECT id, username, ProfileImageID, Bio, Date_joined FROM Users WHERE id=?`
    return new Promise((res, rej) => {
        if(!(requesterID && friendID))
        {
            ctx.body = apiResponse(false, 'missing args');
            return rej(ctx.body);
        }
        if(!(areFriends))
        {   
            ctx.body = apiResponse(false, 'users are not friends');
            return rej(ctx.body);
        }
        conn.query({
            sql,
            values: [friendID]
        }, async (err, rows) => {
            if(err)
            {
                ctx.body = apiResponse(false, err);
                return rej(ctx.body);
            }
            if(rows.length == 0)
            {
                ctx.body = apiResponse(false, `no users found with id ${friendID}`);
                return rej(ctx.body);
            }
            let friendInfo = rows[0];
            const groupIDs = Array.from(await allGroupsForUser(friendID));
            let groups = []
            for (let groupID of groupIDs) {
                const group = await getInfoForGroup(groupID)
                groups.push(group)
            }
            friendInfo.groups = groups;
            ctx.body = friendInfo;
            return res(friendInfo);
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
    confirmFriendRequest,
    getAllFriendRequests,
    denyFriendRequest,
    getFriendInfo
}
