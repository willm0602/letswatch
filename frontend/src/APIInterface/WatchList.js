import { getAccessToken } from "../LocalStorageInterface";
import { post } from "./Utils";

export async function makeWatchList(name, groupID)
{
    post('/watchlist/create', {
        listName: name,
        groupID,
        accessToken: getAccessToken()
    })
}