import { setAccessToken } from "../LocalStorageInterface";
import { get, post } from "./Utils";

export async function searchForMedia(query)
{
    return await get('/media/search', {
        query
    });

}