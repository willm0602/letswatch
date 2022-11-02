import {get} from './Utils';

export async function mediaSearch(query)
{
    return get(`/media/search`, {
        query
    });
}