const conn = require("../../database/mySQLconnect");
const { apiResponse } = require("../../MiscUtils");
const { getIDFromAccessToken } = require("./AccountController");
const {createSinglePersonGroup, getUserGroupID} = require('./GroupController');

async function createList(userID, listName)
{
    let groupID = await getUserGroupID(userID);
    if(!groupID)
    {
        await createSinglePersonGroup(userID);
        groupID = getUserGroupID(userID);
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
        conn.query({
            sql: query,
            values: [
                listName,
                groupID
            ]
        }, (err, tuples) => {
            if(err)
                return rej('unable to make watch list');
            return res(true);
        })
    });
}

async function getListsForGroup(groupID)
{
    const sql = `SELECT * FROM watch_lists WHERE group_id=? ORDER BY id`;
    return new Promise((res, rej) => {
        conn.query({
            sql,
            values: [groupID]
        }, (err, tuples) => {
            if(err)
                rej('Unable to query database for lists for group');
            return tuples;
        })
    })
}

module.exports = {createList}