/**
 * =========================
 * Router @ /media
 * Routes
 *      Get
 *          /search
 *          /all
 *
 *      Post
 * ==========================
 */

const MediaController = require('../Controllers/MediaController')

const KoaRouter = require('koa-router')

const MediaRouter = KoaRouter({
    prefix: '/media',
})

MediaRouter.get('/all', MediaController.allMedia)
MediaRouter.get('/search', MediaController.mediaSearch)

//!NOTE: This must remain on the bottom, otherwise it can cause issues
MediaRouter.get('/:id', async (ctx) => {
    const id = ctx.params.id
    const media = await MediaController.getMediaByID(id)
    ctx.body = media
})

module.exports = MediaRouter
