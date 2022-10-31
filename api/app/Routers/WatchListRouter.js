const WatchListController = require('../Controllers/WatchListController')

const KoaRouter = require('koa-router')

const WatchListRouter = KoaRouter({
    prefix: '/watchlist',
})

WatchListRouter.post('/create', WatchListController.createList)
WatchListRouter.post('/add_media', WatchListController.addMediaToWatchlist)

module.exports = WatchListRouter
