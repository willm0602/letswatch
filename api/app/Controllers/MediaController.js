const axios = require('axios');
const conn = require("../../database/mySQLconnect");
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
                    return {
                        title: media.title,
                        id: media.id,
                        synopsis: media.overview
                    };
                });
                res(ctx.body);
            }
        ).catch((err) => {
            rej(err);
        })
    });
}

async function getPosterPath(path)
{
    return `https://image.tmdb.org/t/p/original${path}`;
}

module.exports = {
    mediaSearch
}