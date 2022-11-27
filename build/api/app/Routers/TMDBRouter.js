/**
 * =========================
 * Router @ /media
 * Routes
 *      Get
 *          /tmdb
 * ==========================
 */

const TMDBController = require('../Controllers/TMDBController')

const KoaRouter = require('koa-router')

const TMDBRouter = KoaRouter({
    prefix: '/tmdb',
})

TMDBRouter.get('/', TMDBController.queryTMDBFromLW)

module.exports = TMDBRouter
