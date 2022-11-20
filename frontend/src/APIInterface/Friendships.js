import { get, post } from "./Utils";
import { getAccessToken } from '../LocalStorageInterface'

export async function getFriends()
{
    return get('/account/friends', {accessToken: getAccessToken()})
}

export async function sendFriendRequest(potentialFriendUsername)
{
    return post('/account/add_friend', {potentialFriendUsername, accessToken: getAccessToken()})
}

export async function acceptFriendRequest(userID)
{
    return post('/account/confirm_friend_request', {
        requesterID: userID,
        accessToken: getAccessToken()
    })
}

export async function addFriendToGroup(friendID, groupID) {
    return post('/account/add_friend_to_group', {
        groupID,
        friendID,
        accessToken: getAccessToken()
    })
}

export async function getAllFriendRequests() {
    return get('/account/get_friend_requests', {accessToken: getAccessToken()})
}