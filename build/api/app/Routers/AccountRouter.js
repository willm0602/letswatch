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
AccountRouter.post('/confirm_friend_request', AccountController.confirmFriendRequest)
AccountRouter.get('/get_friend_requests', AccountController.getAllFriendRequests)
AccountRouter.post('/deny_friend_request', AccountController.denyFriendRequest)
AccountRouter.get('/friend_info', AccountController.getFriendInfo)

module.exports = AccountRouter
