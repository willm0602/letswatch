const axios = require('axios');
const conn = require("../../database/mySQLconnect");
const moment = require('moment');
const {apiResponse} = require('../../MiscUtils');
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
            (resp) => {
                console.log(resp.data);
                ctx.body = resp.data.results.map((media) => {
                    return media.title ? {
                        title: media.title,
                        id: media.id,
                        synopsis: media.overview,
                        image: getPosterPath(media.poster_path),
                        rating: media.vote_average * 10,
                        releaseDate: new Date(moment(media.release_date, 'YYYY-MM-DD')),
                        type: media.media_type
                    } : media.name ? {
                        title: media.name,
                        id: media.id,
                        synopsis: media.overview,
                        image: getPosterPath(media.poster_path),
                        rating: media.vote_average * 10,
                        releaseDate: new Date(moment(media.release_date, 'YYYY-MM-DD')),
                        type: media.media_type
                    } : undefined
                });
                ctx.body.map((media) => {
                    saveMediaToDB(media);
                })
                res(ctx.body);
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

            // if we don't have the media in the database, we need to try to 
            // get the media from TMDB, first checking for a matching movie,
            // then for a matching tv show
            const tmdbMovieURL = `https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbAPIToken}`;
            const movieReq = await axios.get(tmdbMovieURL);
            const movie = movieReq.data;
            console.log(movie);
        })
    })
}


async function saveMediaToDB(media)
{
    const query = `INSERT INTO media(
                        id,
                        title,
                        image_url,
                        rating,
                        release_data,
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
                media.id,
                media.title,
                media.image,
                media.rating,
                media.release_date,
                media.synopsis,
                media.type
            ]
        }, (err, tuples) => {
            if(err)
                return false;
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