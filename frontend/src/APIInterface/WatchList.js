import { post } from "./Utils";

export async function makeWatchList(name, groupID)
{
    post('/watchlist/create')
}