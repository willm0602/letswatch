/**
 * ==========================
 */

const GroupController = require('../Controllers/GroupController')

const KoaRouter = require('koa-router')

const GroupRouter = KoaRouter({
    prefix: '/group',
})

GroupRouter.post('/create', GroupController.createGroup)

module.exports = GroupRouter
