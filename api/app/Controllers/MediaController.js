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
                        title,
                        image_url,
                        rating,
                        
                    )`
}

function getPosterPath(path)
{
    return path ? `https://image.tmdb.org/t/p/original${path}` 
                : undefined;
}

module.exports = {
    mediaSearch
}