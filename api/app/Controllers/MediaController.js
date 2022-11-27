const axios = require('axios')
const moment = require('moment')

const conn = require('../../database/mySQLconnect')
const { apiResponse } = require('../../MiscUtils')
const C = require('../../config/Constants')

const tmdbAPIToken = process.env.TMDB


/**
 * Adds trailer to media objects
 * 
 * mediaList: List[Media*]
 *      the list of media objects to have trailers added to them
 * 
 */
async function addTrailers(mediaList) {
    let mediaWithTrailers = []
    for (let media of mediaList) {
        let trailerURL = await getTrailerPath(media)
        if (trailerURL != undefined) {
            media['trailerPath'] = trailerURL
            mediaWithTrailers.push(media)
        }
    }
    return mediaWithTrailers
}


/**
 * Searches TMDB for media, adds it to our database and then returns the data for everything
 * in the search query
 * 
 * Parameters (passed through ctx)
 * -------------------------------
 * query: str
 *      the query that is being searched for
 * 
 * returns media
 */
async function mediaSearch(ctx) {
    const queryParams = ctx.request.query
    const query = queryParams.query
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${tmdbAPIToken}&language=en-US&page=1&include_adult=false&query=${query
        .split(' ')
        .join('+')}`
    console.log(`url is`, url)
    return new Promise(async (res, rej) => {
        const resp = await axios.get(url)
        const tmdbData = resp.data.results.map((media) => {
            if (!Object.values(C.MEDIA_TYPES).includes(media.media_type)) {
                return undefined
            }
            return media.title
                ? {
                      title: media.title,
                      tmdbID: media.id,
                      synopsis: media.overview,
                      image: getPosterPath(media.poster_path),
                      rating: media.vote_average * 10,
                      releaseDate: new Date(
                          moment(media.release_date, 'YYYY-MM-DD')
                      ),
                      type: media.media_type,
                  }
                : media.name
                ? {
                      title: media.name,
                      tmdbID: media.id,
                      synopsis: media.overview,
                      image: getPosterPath(media.poster_path),
                      rating: media.vote_average * 10,
                      releaseDate: new Date(
                          moment(media.first_air_date, 'YYYY-MM-DD')
                      ),
                      type: media.media_type,
                  }
                : undefined
        })

        const tmdbDataWithTrailers = await addTrailers(tmdbData)

        const validTMDBData = tmdbDataWithTrailers.filter(
            (val) => val !== undefined
        )

        let letsWatchSearchResults = []
        for (let media of validTMDBData) {
            const id = await saveMediaToDB(media)
            letsWatchSearchResults.push({
                ...media,
                id,
            })
        }

        ctx.body = letsWatchSearchResults
        return res(letsWatchSearchResults)
    })
}


/**
 * Returns the url for a trailer of a media object
 * 
 * Parameters
 * ----------
 * media: media*   
 *      the media that we are adding the trailer for
 * 
 */
async function getTrailerPath(media) {
    let trailerURL
    if (media === undefined) return undefined
    if (media.type === C.MEDIA_TYPES.MOVIE)
        trailerURL = `https://api.themoviedb.org/3/movie/${media.tmdbID}/videos?api_key=${tmdbAPIToken}`
    if (media.type === C.MEDIA_TYPES.TV)
        trailerURL = `https://api.themoviedb.org/3/tv/${media.tmdbID}/videos?api_key=${tmdbAPIToken}`
    return axios
        .get(trailerURL)
        .then((res) => {
            for (const vid of res.data.results) {
                if (vid.type == 'Trailer' && vid.site == 'YouTube')
                    return `https://www.youtube.com/watch?v=${vid.key}`
            }
            return undefined
        })
        .catch((err) => {
            console.error(err)
            return undefined
        })
}


/**
 * Gets the information of a media object given its ID in our database
 * 
 * NOTE: the id of the media object in our database is different than the id in the
 * TMDB API database
 * 
 * Parameters
 * -----------
 * id: int
 *      id of the media object we are returning information for
*/
async function getMediaByID(id) {
    const query = `SELECT * FROM media WHERE id=?;`

    return new Promise((res, rej) => {
        conn.query(
            {
                sql: query,
                values: [id],
            },
            async (err, tuples) => {
                if (err)
                    return rej('unable to query our database to get movies')
                if (tuples.length > 0) return res(tuples[0])
                return rej(`media w/ id ${id} doesn't exist`)
            }
        )
    })
}

/**
 * checks if we have a media object in the Let's Watch Database given a TMDB ID and a media
 * type (movie or show)
 * 
 * Parameters
 * ---------------
 * mediaID: int
 *      id of the media as it exists in the TMDB API (NOT Let's Watch database)
 * mediaType: string
 *      the type that the media is (either tv or movie)
*/ 
async function existsInDatabase(mediaID, mediaType) {
    const query = `SELECT * 
                    FROM media 
                        WHERE type=?
                        AND tmdb_id=?`
    return new Promise((res, rej) => {
        conn.query(
            {
                sql: query,
                values: [mediaType, mediaID],
            },
            (err, tuples) => {
                if (err) return rej('unable to access database')
                if (tuples.length) return res(tuples[0].id)
                return res(false)
            }
        )
    })
}

/**
 * Saves a media object to our database 
 * 
 * Parameters
 * ------------
 * media: object
 *      JSON object containing all the information from TMDB that we want to save to our database
 * 
*/ 
async function saveMediaToDB(media) {
    const alreadyExists = await existsInDatabase(media.tmdbID, media.type)

    const query = `INSERT INTO media(
                        tmdb_id,
                        title,
                        image_url,
                        rating,
                        release_date,
                        synopsis,
                        type,
                        trailer_path
                    ) VALUES(
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?
                    )`
    return new Promise(async (res, rej) => {
        if (alreadyExists) {
            return res(alreadyExists)
        }
        conn.query(
            {
                sql: query,
                values: [
                    media.tmdbID,
                    media.title,
                    media.image,
                    media.rating,
                    media.releaseDate,
                    media.synopsis,
                    media.type,
                    media.trailerURL,
                ],
            },
            async (err, tuples) => {
                if (err) {
                    console.error('Error saving media:', err)
                    return false
                }
                return res(await existsInDatabase(media.tmdbID, media.type))
            }
        )
    })
}

// Utility function to get the path of a media object given its poster location
function getPosterPath(path) {
    return path ? `https://image.tmdb.org/t/p/original${path}` : undefined
}


/**
 * API Call to get all media from OUR database (not all from TMDB)
 * 
*/ 
async function allMedia(ctx) {
    const sql = `SELECT * FROM Media;`
    return new Promise((res, rej) => {
        conn.query(
            {
                sql,
                values: [],
            },
            (err, rows) => {
                if (err) {
                    console.error(err)
                    ctx.body = apiResponse(false, err)
                    return rej('unable to query database for media')
                }
                ctx.body = rows
                return res(rows)
            }
        )
    })
}

/**
 * API call to add a media object to our database given a TMDB ID and a type
 * NOTE: this will only add it if we don't already have that media object inside 
 * our database
 * 
 * Parameters (passed through query parameters)
 * ---------------------------------------------
 * tmdbID: int
 *      id of the media object as represented in the TMDB API
 * type: string
 *      string representing the type that a media is (either tv or movie)
*/ 
async function axiosAddMedia(ctx) {
    const queryParams = ctx.request.query
    const { tmdbID, type } = queryParams
    return new Promise(async (res, rej) => {
        if (!(tmdbID && type)) {
            ctx.body = undefined
            return rej('Missing TMDB ID or type')
        }
        const currentID = await existsInDatabase(tmdbID, type)
        if (currentID) {
            ctx.body = currentID
            return res(ctx.body)
        }
        const media =
            type == 'tv'
                ? await getTVFromTMDB(tmdbID)
                : await getMovieFromTMDB(tmdbID)
        const cleanedMediaData = media.title
            ? {
                  title: media.title,
                  tmdbID: media.id,
                  synopsis: media.overview,
                  image: getPosterPath(media.poster_path),
                  rating: media.vote_average * 10,
                  releaseDate: new Date(
                      moment(media.release_date, 'YYYY-MM-DD')
                  ),
                  type,
              }
            : media.name
            ? {
                  title: media.name,
                  tmdbID: media.id,
                  synopsis: media.overview,
                  image: getPosterPath(media.poster_path),
                  rating: media.vote_average * 10,
                  releaseDate: new Date(
                      moment(media.first_air_date, 'YYYY-MM-DD')
                  ),
                  type,
              }
            : undefined
        saveMediaToDB(cleanedMediaData)
            .then((resp) => {
                ctx.body = resp
                return res(resp)
            })
            .catch((err) => {
                ctx.body = undefined
                return rej()
            })
    })
}


// Utility function to get information on a tv show given a TMDB id
async function getTVFromTMDB(id) {
    const url = `https://api.themoviedb.org/3/tv/${id}?api_key=${tmdbAPIToken}`
    return new Promise((res, rej) => {
        axios
            .get(url)
            .then((resp) => {
                return res(resp.data)
            })
            .catch((err) => {
                return rej(err)
            })
    })
}

// Utility function to get information on a movie given a TMDB id
async function getMovieFromTMDB(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbAPIToken}`
    return new Promise((res, rej) => {
        axios
            .get(url)
            .then((resp) => {
                return res(resp.data)
            })
            .catch((err) => {
                return rej(err)
            })
    })
}

module.exports = {
    mediaSearch,
    getMediaByID,
    allMedia,
    axiosAddMedia,
}
