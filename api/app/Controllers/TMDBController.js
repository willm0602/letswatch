const axios = require('axios')

const TMDBAPIToken = process.env.tmdb

async function queryTMDBFromLW(ctx) {
    const baseURL = `https://api.themoviedb.org/3/`
    var queryParams = ctx.request.query
    const { path } = queryParams
    if (!path) {
        ctx.body = 'no url provided'
    }
    const url = baseURL + path + '?' + `&api_key=${TMDBAPIToken}`
    console.log(`url is`, url)

    return new Promise((res, rej) => {
        axios
            .get(`${url}`)
            .then((resp) => {
                if (resp.data) {
                    ctx.body = resp.data
                    return res(resp.data)
                }
                return rej('no data')
            })
            .catch((resp) => {
                if (resp.data) {
                    ctx.body = resp.data
                    return rej(resp.data)
                }
                return rej('no data and failed')
            })
    })
}

module.exports = { queryTMDBFromLW }
