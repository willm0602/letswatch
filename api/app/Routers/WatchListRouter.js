const WatchListController = require('../Controllers/WatchListController');

const KoaRouter = require('koa-router');
 
const WatchListRouter = KoaRouter({
    prefix: '/watchlist'
});

WatchListRouter.post('/create', WatchListController.createList);

module.exports = WatchListRouter;