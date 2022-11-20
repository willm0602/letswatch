import { getAccessToken } from '../LocalStorageInterface'
import { post } from './Utils'

export async function makeWatchList(name, groupID) {
    return post('/watchlist/create', {
        listName: name,
        groupID,
        accessToken: getAccessToken(),
    })
}

export async function addMediaToWatchlist(listID, mediaID) {
    return post('/watchlist/add_media', {
        mediaID,
        listID,
        accessToken: getAccessToken(),
    })
}

export async function removeMediaFromWatchList(listID, mediaID) {
    return post('/watchlist/remove_media', {
        listID,
        mediaID,
    })
}

export async function joinList(listID) {
    return post('/watchlist/join', {
        listID,
        accessToken: getAccessToken(),
    })
}