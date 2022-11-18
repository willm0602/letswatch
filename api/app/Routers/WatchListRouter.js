const WatchListController = require('../Controllers/WatchListController')

const KoaRouter = require('koa-router')

const WatchListRouter = KoaRouter({
    prefix: '/watchlist',
})

WatchListRouter.post('/create', WatchListController.createList)
WatchListRouter.post('/add_media', WatchListController.addMediaToWatchlist)
WatchListRouter.post(
    '/remove_media',
    WatchListController.removeMediaFromWatchList
)
WatchListRouter.post('/join', WatchListController.addSelfToWatchlist)

module.exports = WatchListRouter
