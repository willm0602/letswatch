/**
 * =========================
 * Router @ /account
 * Routes
 *      Get
 *          /account/test
 *          /login
 *
 *      Post
 *          /signup
 * ==========================
 */

const AccountController = require('../Controllers/AccountController.js')

const KoaRouter = require('koa-router')

const AccountRouter = KoaRouter({
    prefix: '/account',
})

AccountRouter.get('/test', AccountController.test)
AccountRouter.post('/signup', AccountController.signup)
AccountRouter.get('/login', AccountController.login)
AccountRouter.get('/info', AccountController.allInfo)

module.exports = AccountRouter
