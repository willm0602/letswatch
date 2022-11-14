const conn = require('../../database/mySQLconnect')
const {
    apiResponse,
    getIDFromAccessToken,
    userIsInGroup,
} = require('../../MiscUtils')
const AccountController = require('./AccountController')
const {
    createListForSingleUser,
    getListsForGroup,
} = require('./WatchListController')

/**
 * Function that makes a group with a single list for a single user
 *
 * Parameters
 * ----------
 * userID: int
 *      the id of the user to make the list and group for
 */
async function createSinglePersonGroup(userID) {
    const sql = `INSERT INTO user_groups(
                                Name
                                ) 
                            VALUES(
                                ?
                            )`
    const groupName = `${userID}-sologroup`
    return new Promise(async (res, rej) => {
        const query = conn.query(
            {
                sql,
                values: [groupName],
            },
            async (err, tuples) => {
                console.log(query.sql)
                if (err) return rej(err)
                await createListForSingleUser(
                    userID,
                    `Watch List for ${userID}`
                )
                const groupID = await getUserSoloGroupID(userID)
                await conn.query(
                    {
                        sql: `INSERT INTO user_group_memberships(
                        user_id,
                        group_id
                    ) VALUES(
                        ?,
                        ?
                    )
                     `,
                        values: [userID, groupID],
                    },
                    (err, tuples) => {
                        if (err) return rej(err)
                        return res('succesfully made group')
                    }
                )
            }
        )
    })
}

// in both here and WatchListController to prevent circular imports
async function getUserSoloGroupID(userID) {
    const query = `SELECT * FROM user_groups WHERE Name=?;`
    return new Promise((res, rej) => {
        conn.query(
            {
                sql: query,
                values: [`${userID}-sologroup`],
            },
            async (err, tuples) => {
                if (err) return rej('Unable to get group')
                if (tuples.length === 0) return rej('User does not have group')
                return res(tuples[0].id)
            }
        )
    })
}

/**
 * Adds a user to a group
 *
 * Parameters
 * ----------
 * userID: int
 *      the id of the user to add to a group
 * groupID: int
 *      the id of the group that the user is going to be added to
 *
 * returns true if user is succesfully added to group, otherwise it is rejected
 */
async function addUserToGroup(userID, groupID) {
    const usersAlreadyInGroup = await getUsersForGroup(groupID)
    const userAlreadyInGroup = usersAlreadyInGroup.reduce((prev, curr) => {
        if (prev) return true
        if (curr.id === userID) return true
        return false
    }, false)
    return new Promise((res, rej) => {
        if (userAlreadyInGroup) return rej('User already in group')
        conn.query(
            {
                sql: `INSERT INTO user_group_memberships(user_id, group_id) VALUES(?, ?)`,
                values: [userID, groupID],
            },
            (err, rows) => {
                if (err) return rej(`Unable to add user to group`)
                return res(true)
            }
        )
    })
}

/**
 * Gets all information for a group
 *
 * Parameters
 * ---------------
 * id: int
 *      the id of the group we are getting the information for
 */
async function getInfoForGroup(id) {
    const sql = `SELECT * FROM user_groups WHERE id=?`
    const members = await getUsersForGroup(id)

    return new Promise((res, rej) => {
        conn.query(
            {
                sql,
                values: [id],
            },
            async (err, tuples) => {
                if (err) return rej(err)
                if (tuples.length === 0) return rej('User Group does not exist')
                const tuple = tuples[0]
                const lists = await getListsForGroup(tuple.id)
                return res({
                    groupID: tuple.id,
                    groupName: tuple.Name,
                    members: members.map((member) => {
                        return {
                            username: member.Username,
                            profileID: member.ProfileImageID,
                            id: member.id,
                        }
                    }),
                    lists,
                })
            }
        )
    })
}


/**
 * Gets all of the users for a group
 * 
 * Parameters
 * ----------
 * groupID: int
 *     the id of the group that we are getting the users for
 * 
 * returns the username, profile image id and user id of each user in the group
 * 
 */ 
async function getUsersForGroup(groupID) {
    const sql = `SELECT Username, ProfileImageID, users.id FROM letswatch.user_groups 
	                LEFT JOIN letswatch.user_group_memberships 
		                ON letswatch.user_groups.id=letswatch.user_group_memberships.group_id
	                RIGHT JOIN letswatch.users
		                ON letswatch.users.id=letswatch.user_group_memberships.user_id
	            WHERE group_id=?;`
    return new Promise((res, rej) => {
        conn.query(
            {
                sql,
                values: [groupID],
            },
            (err, rows) => {
                if (err) return rej(err)
                return res(rows)
            }
        )
    })
}

/*
    Routed function used to create a group

    query parameters (through ctx)
    ------------------------------
    accessToken: str
        access token of user that is creating the group
    
    groupName: str
        name of the group being made by the user
*/
async function createGroup(ctx) {
    const queryParams = ctx.request.query
    const { accessToken, groupName } = queryParams
    const insertSQL = `INSERT INTO user_groups(NAME) Values(?);`

    return new Promise(async (res, rej) => {
        conn.query(
            {
                sql: insertSQL,
                values: [groupName],
            },
            async (err, rows) => {
                if (err) {
                    ctx.body = err
                    return rej(err)
                }
                const groupID = await guessNewGroupID(groupName)
                const userID = await getIDFromAccessToken(accessToken)
                addUserToGroup(userID, groupID)
                    .then(() => {
                        ctx.body = groupID
                        return res(groupID)
                    })
                    .catch((err) => {
                        ctx.body = err
                        return rej(err)
                    })
            }
        )
    })
}

// guesses the id of a newly created group given a name
async function guessNewGroupID(groupName) {
    const getIDSql = `SELECT * FROM user_groups WHERE NAME=? ORDER BY ID DESC LIMIT 1`

    return new Promise((res, rej) => {
        conn.query(
            {
                sql: getIDSql,
                values: [groupName],
            },
            (err, rows) => {
                if (err) {
                    return rej(err)
                }
                if (rows.length === 0) {
                    return rej(warningMessage)
                }
                return res(rows[0].id)
            }
        )
    })
}

/**
 * Adds a user to a group from an API call at /group/add_user
 *
 * Parameters (passed through ctx)
 * ------------------------------------
 * accessToken: str
 *      access token of the user requesting the other user to join the group
 * userID: int
 *      the id of the user that is going to be added to the group (assuming they are
 *      able to)
 * groupID: int
 *      the id of the group that the user is being added to
 */
async function ajaxAddUserToGroup(ctx) {
    const { accessToken, userID, groupID } = ctx.request.query
    const requestingUserInGroup = await userIsInGroup(accessToken, groupID)
    return new Promise(async (res, rej) => {
        if (requestingUserInGroup) {
            const userAlreadyInGroup = await userIsInGroup(
                undefined,
                groupID,
                userID
            )
            console.log(`userAlreadyInGroup is`, userAlreadyInGroup)
            if (userAlreadyInGroup) {
                const errorMessage = apiResponse(
                    false,
                    'User is already in group'
                )
                ctx.body = errorMessage
                return rej(errorMessage)
            }
            return addUserToGroup(userID, groupID)
                .then(() => {
                    const success = apiResponse(true, 'Added user to group')
                    ctx.body = success
                    return res(success)
                })
                .catch((err) => {
                    const error = apiResponse(false, err)
                    ctx.body = error
                    return rej(err)
                })
        }
        console.log(requestingUserInGroup, 'requesting user in group')
        const errorMessage = apiResponse(
            false,
            `Error: Requesting User Does Not Belong to Group`
        )
        ctx.body = errorMessage
        return rej(errorMessage)
    })
}

module.exports = {
    createSinglePersonGroup,
    getInfoForGroup,
    createGroup,
    addUserToGroup,
    ajaxAddUserToGroup,
}
