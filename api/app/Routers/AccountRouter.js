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
AccountRouter.post('/add_friend', AccountController.addFriend)
AccountRouter.get('/friends', AccountController.allFriends)
AccountRouter.post('/add_friend_to_group', AccountController.addFriendToGroup)

module.exports = AccountRouter
