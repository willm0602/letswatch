const axios = require('axios')
const moment = require('moment')

const conn = require('../../database/mySQLconnect')
const { apiResponse } = require('../../MiscUtils')
const C = require('../../config/Constants')

const tmdbAPIToken = process.env.TMDB

async function mediaSearch(ctx) {
    const queryParams = ctx.request.query
    const query = queryParams.query
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${tmdbAPIToken}&language=en-US&page=1&include_adult=false&query=${query
        .split(' ')
        .join('+')}`

    return new Promise(async (res, rej) => {
        const resp = await axios.get(url)
        console.log(`resp is`, resp.data.results)
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

        const validTMDBData = tmdbData.filter((val) => val !== undefined)

        let letsWatchSearchResults = []
        for (let media of validTMDBData) {
            const id = await saveMediaToDB(media)
            letsWatchSearchResults.push({
                ...media,
                id,
            })
        }

        ctx.body = letsWatchSearchResults
        console.log(`ctxBody is ${ctx.body}`)

        return res(letsWatchSearchResults)
    })
}

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
                console.log(`got packet for exists`, tuples[0])
                if (tuples.length) return res(tuples[0].id)
                return res(false)
            }
        )
    })
}

async function saveMediaToDB(media) {
    const alreadyExists = await existsInDatabase(media.tmdbID, media.type)

    const query = `INSERT INTO media(
                        tmdb_id,
                        title,
                        image_url,
                        rating,
                        release_date,
                        synopsis,
                        type
                    ) VALUES(
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
                    media.release_date,
                    media.synopsis,
                    media.type,
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

function getPosterPath(path) {
    return path ? `https://image.tmdb.org/t/p/original${path}` : undefined
}

async function allMedia(ctx) {
    console.log(`allMedia called`)
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

module.exports = {
    mediaSearch,
    getMediaByID,
    allMedia,
}
