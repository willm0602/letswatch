const axios = require('axios');
const moment = require('moment');

const conn = require("../../database/mySQLconnect");
const {apiResponse} = require('../../MiscUtils');
const C = require('../../config/Constants');

const tmdbAPIToken = process.env.TMDB;

async function mediaSearch(ctx)
{
    const queryParams = ctx.request.query;
    const query = queryParams.query;
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${tmdbAPIToken}&language=en-US&page=1&include_adult=false&query=${
        query.split(' ').join('+')
    }`;

    return new Promise((res, rej) => {
        axios.get(url).then(
            async (resp) => {
                ctx.body = resp.data.results.map((media) => {
                    console.log(media);
                    if(!Object.values(C.MEDIA_TYPES).includes(media.media_type))
                    {
                        return undefined;
                    }
                    return media.title ? {
                        title: media.title,
                        tmdbID: media.id,
                        synopsis: media.overview,
                        image: getPosterPath(media.poster_path),
                        rating: media.vote_average * 10,
                        releaseDate: new Date(moment(media.release_date, 'YYYY-MM-DD')),
                        type: media.media_type
                    } : media.name ? {
                        title: media.name,
                        tmdbID: media.id,
                        synopsis: media.overview,
                        image: getPosterPath(media.poster_path),
                        rating: media.vote_average * 10,
                        releaseDate: new Date(moment(media.first_air_date, 'YYYY-MM-DD')),
                        type: media.media_type
                    } : undefined
                });

                ctx.body = ctx.body.filter( val => val!==undefined);

                await ctx.body.map(async (media) => {
                    await saveMediaToDB(media);
                })

                ctx.body = ctx.body.map(async (media) => {
                    const lw = await existsInDatabase(media.tmdbID, media.type);
                    const id = lw.id;
                    if(id)
                        return {
                            ...media,
                            id
                        }
                }).then(() => {
                    res(ctx.body);
                })
            }
        ).catch((err) => {
            rej(err);
        })
    });
}

async function getMediaByID(id)
{
    const query = `SELECT * FROM media WHERE id=?;`;

    return new Promise((res, rej) => {
        conn.query({
            sql: query,
            values: [id]
        }, async (err, tuples) => {
            if(err)
                rej('unable to query our database to get movies');
            if(tuples.length > 0)
                return res(tuples[0]);
        })
    })
}

async function existsInDatabase(mediaID, mediaType)
{
    const query = `SELECT * 
                    FROM media 
                        WHERE type=?
                        AND tmdb_id=?`;
    return new Promise((res, rej) => {
        conn.query({
            sql: query,
            values: [
                mediaType,
                mediaID
            ]
        }, (err, tuples) => {
            if(err)
                return rej('unable to access database');
            if(tuples.length)
                return res(tuples[0]);
            return res(false);
        })
    })
}

async function saveMediaToDB(media)
{
    const alreadyExists = await existsInDatabase(media.tmdbID, media.type);
    if(alreadyExists)
    {
        return;
    }

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
                    )`;
    return new Promise((res, rej) => {
        conn.query({
            sql: query,
            values: [
                media.tmdbID,
                media.title,
                media.image,
                media.rating,
                media.release_date,
                media.synopsis,
                media.type
            ]
        }, (err, tuples) => {
            if(err)
            {
                console.error('Error saving media:', err);
                return false;
            }
            return true;
        })
    });
}

function getPosterPath(path)
{
    return path ? `https://image.tmdb.org/t/p/original${path}` 
                : undefined;
}

module.exports = {
    mediaSearch,
    getMediaByID
}