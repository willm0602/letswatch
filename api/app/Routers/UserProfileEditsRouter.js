const UserProfileEditsController = require('../Controllers/UserProfileEditsController')

const KoaRouter = require('koa-router')

const UserProfileEditsRouter = KoaRouter({
    prefix: '/edit',
})

UserProfileEditsRouter.post('/bio', UserProfileEditsController.changeBio)
UserProfileEditsRouter.post('/image', UserProfileEditsController.changeImage)

module.exports = UserProfileEditsRouter