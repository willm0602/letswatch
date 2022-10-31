const conn = require('../../database/mySQLconnect')
const AccountController = require('./AccountController')
const { createList, getListsForGroup } = require('./WatchListController')

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
                await createList(userID, `Watch List for ${userID}`)
                const groupID = await getUserGroupID(userID)
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
async function getUserGroupID(userID) {
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

async function getInfoForGroup(id) {
    console.log('getting info for group')
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
                const lists = await getListsForGroup(tuple.id);
                return res({
                    groupID: tuple.id,
                    groupName: tuple.Name,
                    members: members.map((member) => {
                        return {
                            username: member.Username,
                            profileID: member.ProfileImageID,
                        }
                    }),
                    lists
                })
            }
        )
    })
}

async function getUsersForGroup(groupID) {
    const sql = `SELECT Username, ProfileImageID FROM letswatch.user_groups 
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

module.exports = {
    createSinglePersonGroup,
    getInfoForGroup,
}
