import { get } from "svelte/store";

export async function getFriends()
{
    return get('/account/friends')
}

export async function sendFriendRequest(userID)
{
    return post('/account/add_friend', {userID})
}

export async function acceptFriendRequest(userID)
{
    return post('/account/confirm_friend_request', {
        requesterID: userID
    })
}

export async function addFriendToGroup(friendID, groupID) {
    return post('/account/add_friend_to_group', {
        groupID,
        friendID
    })
}

export async function getAllFriendRequests() {
    return get('/account/get_friend_requests')
}