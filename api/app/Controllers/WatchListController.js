const conn = require('../../database/mySQLconnect')
const { apiResponse, getIDFromAccessToken } = require('../../MiscUtils')
const { createSinglePersonGroup } = require('./GroupController')

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

async function createList(userID, listName) {
    console.log(getUserGroupID)
    let groupID = await getUserGroupID(userID)
    if (!groupID) {
        await createSinglePersonGroup(userID)
        groupID = getUserGroupID(userID)
    }

    const query = `INSERT INTO watch_lists(
                                    Name,
                                    group_id
                                )
                            VALUES(
                                ?,
                                ?
                            )`
    return new Promise((res, rej) => {
        conn.query(
            {
                sql: query,
                values: [listName, groupID],
            },
            async (err, tuples) => {
                if (err) return rej('unable to make watch list')
                const userList = await getListsForGroup(groupID)
                conn.query(
                    {
                        sql: `INSERT INTO user_list_memberships(
                        user_id,
                        list_id
                    ) VALUES(
                        ?,
                        ?
                    )`,
                        values: [userID, userList[0].listID],
                    },
                    (err, tuples) => {
                        if (err) return rej(err)
                        return res('created new list')
                    }
                )
            }
        )
    })
}

async function getListsForGroup(groupID) {
    const sql = `SELECT * FROM watch_lists WHERE group_id=? ORDER BY id`
    return new Promise((res, rej) => {
        conn.query(
            {
                sql,
                values: [groupID],
            },
            async (err, tuples) => {
                if (err)
                    return rej('Unable to query database for lists for group')
                let watchLists = [];
                for(let tuple of tuples)
                {
                    const listMembers = await getUsersForList(tuple.id);
                    const media = await getMediaForWatchList(tuple.id);
                    const watchList = {
                        listName: tuple.Name,
                        listID: tuple.id,
                        listMembers: listMembers.map((member) => {return {
                            username: member.Username,
                            profileID: member.ProfileImageID
                        }}),
                        media
                    };
                    watchLists.push(watchList);
                }
                return res(watchLists);
            }
        )
    })
}

async function getUsersForList(listID) {
    const sql = `SELECT Username, ProfileImageID FROM letswatch.watch_lists
	                LEFT JOIN letswatch.user_list_memberships 
		                ON letswatch.watch_lists.id=letswatch.user_list_memberships.list_id
	                RIGHT JOIN letswatch.users
		                ON letswatch.users.id=letswatch.user_list_memberships.user_id
	            WHERE list_id=?;`
    return new Promise((res, rej) => {
        conn.query(
            {
                sql,
                values: [listID],
            },
            (err, rows) => {
                if (err) return rej(err)
                return res(rows)
            }
        )
    })
}

async function addMediaToWatchlist(ctx) {
    const mediaID = ctx.request.query.mediaID;
    const listID = ctx.request.query.listID;
    const accessToken = ctx.request.query.accessToken;

    const userID = await getIDFromAccessToken(accessToken);

    const sql = `INSERT INTO watch_list_items(
                    watchlist_id,
                    media_id,
                    user_added_by_id,
                    date_added
                ) VALUES(
                    ?,
                    ?,
                    ?,
                    ?
                );`
    return new Promise((res, rej) => {
        const query = conn.query({
            sql,
            values: [
                listID,
                mediaID,
                userID,
                new Date()
            ]
        }, (err, rows) => {
            console.log(query.sql);
            if(err)
            {
                ctx.body = apiResponse(false, err);
                return rej(err);
            }
            ctx.body = apiResponse(true, "Success");
            return res('Added media to watch list');                
        })
    })
}

async function getMediaForWatchList(watchListID) {
    const sql = `SELECT * FROM letswatch.watch_list_items
	INNER JOIN letswatch.media 
    ON letswatch.watch_list_items.media_id=letswatch.media.id
    INNER JOIN letswatch.users
    ON letswatch.watch_list_items.user_added_by_id=letswatch.users.id
    ;`

    return new Promise((res, rej) => {
        conn.query({
            sql,
            values: [watchListID]
        }, (err, rows) => {
            if(err)
                return rej(err);
            let allMedia = [];
            for(let row of rows)
            {

                let media = {
                    title: row.title,
                    poster: row.image_url,
                    synopsis: row.synopsis,
                    score: row.rating,
                    addedBy: row.Username
                }
                console.log(`media is`, media);
                allMedia.push(media);
            }
            return res(allMedia);
        })
    })
}

module.exports = { createList, getListsForGroup, addMediaToWatchlist }
