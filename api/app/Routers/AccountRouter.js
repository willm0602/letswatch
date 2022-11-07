/**
 * =========================
 * Router @ /account
 * Routes
 *      Get
 *          /account/login
 *              username, password
 *
 *          /account/info
 *
 *
 *      Post
 *          /account/signup
 * ==========================
 */

const AccountController = require('../Controllers/AccountController.js')

const KoaRouter = require('koa-router')

const AccountRouter = KoaRouter({
    prefix: '/account',
})

AccountRouter.post('/signup', AccountController.signup)
AccountRouter.get('/login', AccountController.login)
AccountRouter.get('/info', AccountController.allInfo)

module.exports = AccountRouter
