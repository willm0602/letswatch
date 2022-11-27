/**
 * ==========================
 */

const GroupController = require('../Controllers/GroupController')

const KoaRouter = require('koa-router')

const GroupRouter = KoaRouter({
    prefix: '/group',
})

GroupRouter.post('/create', GroupController.createGroup)
GroupRouter.post('/add_user', GroupController.ajaxAddUserToGroup)

module.exports = GroupRouter
