import { get } from './Utils'

export async function mediaSearch(query) {
    return get(`/media/search`, {
        query,
    })
}

export async function getMediaByID(id) {
    return get(`/media/${id}`);
}