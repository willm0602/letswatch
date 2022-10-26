const axios = require('axios');
const conn = require("../../database/mySQLconnect");
const moment = require('moment');
const {apiResponse} = require('../../MiscUtils');

async function mediaSearch(ctx)
{
    const queryParams = ctx.request.query;
    const query = queryParams.query;
    const tmdbAPIToken = process.env.TMDB;
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${tmdbAPIToken}&language=en-US&page=1&include_adult=false&query=${
        query.split(' ').join('+')
    }`;

    return new Promise((res, rej) => {
        axios.get(url).then(
            (resp) => {
                ctx.body = resp.data.results.map((media) => {
                    return media.title ? {
                        title: media.title,
                        id: media.id,
                        synopsis: media.overview,
                        image: getPosterPath(media.poster_path),
                        rating: media.vote_average * 10,
                        releaseDate: new Date(moment(media.release_date, 'YYYY-MM-DD'))
                    } : media.name ? {
                        title: media.name,
                        id: media.id,
                        synopsis: media.overview,
                        image: getPosterPath(media.poster_path),
                        rating: media.vote_average * 10,
                        releaseDate: new Date(moment(media.release_date, 'YYYY-MM-DD'))
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

async function saveMediaToDB(media)
{
    const query = `INSERT INTO media(
                        id,
                        title,
                        image_url,
                        rating,
                        release_data,
                        synopsis
                    ) VALUES(
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
                media.synopsis
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
    mediaSearch
}