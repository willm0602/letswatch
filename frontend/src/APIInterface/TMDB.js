import { get } from "./Utils";

// not the best practice but can be a faster way to get a direct route to TMDB
export default function getFromTMDB(path)
{
    return get('/tmdb/', {
        path
    })
}