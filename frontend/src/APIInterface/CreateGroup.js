import { getAccessToken } from '../LocalStorageInterface'
import { post } from './Utils'

export async function makeNewGroup(name, userID) {
    post('/group/create', {
        groupName: name,
        userID,
        accessToken: getAccessToken(),
    })
}

export async function addUserToGroup(groupID, userID) {
    post('/group/add_user', {
        groupID,
        userID,
    })
}
