import { setAccessToken } from '../LocalStorageInterface'
import { get, post } from './Utils'

export async function searchForMedia(query) {
    return await get('/media/search', {
        query,
    })
}

export async function addMediaByIDAndType(id, type) {
    return post('/media/add_with_id_and_type', {
        tmdbID: id,
        type: type
    })
}