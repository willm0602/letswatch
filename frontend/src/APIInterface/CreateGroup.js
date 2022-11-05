import { getAccessToken } from "../LocalStorageInterface";
import { post } from "./Utils";

export async function makeNewGroup(name, userID)
{
    post('/group/create', {
        groupName: name,
        userID,
        accessToken: getAccessToken()
    })
}