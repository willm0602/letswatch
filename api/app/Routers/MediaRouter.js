/**
 * =========================
 * Router @ /media  
 * Routes
 *      Get
 *          /search
 *  
 *      Post
 * ==========================
 */

const MediaController = require('../Controllers/MediaController');

const KoaRouter = require('koa-router');
 
const MediaRouter = KoaRouter({
    prefix: '/media'
});

MediaRouter.get('/search', MediaController.mediaSearch);

module.exports = MediaRouter;
