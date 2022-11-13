import { getAccessToken } from '../LocalStorageInterface'
import { post } from './Utils'

export async function makeWatchList(name, groupID) {
    post('/watchlist/create', {
        listName: name,
        groupID,
        accessToken: getAccessToken(),
    })
}

export async function addMediaToWatchlist(listID, mediaID){
    post('/watchlist/add_media', {
        mediaID,
        listID,
        accessToken: getAccessToken()
    });
}

export function removeMediaFromWatchList(listID, mediaID){
    post('/watchlist/remove_media', {
        listID,
        mediaID
    })
}