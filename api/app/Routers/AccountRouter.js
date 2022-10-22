/**
 * =========================
 * Router @ /account  
 * Routes
 *      /account/test
 * ==========================
 */


const AccountController = require('../Controllers/AccountController.js');

const KoaRouter = require('koa-router');

const AccountRouter = KoaRouter({
    prefix: '/account'
});

AccountRouter.get('/test', AccountController.test);
AccountRouter.post('/signup', AccountController.signup)
AccountRouter.get('/login', AccountController.login)

module.exports = AccountRouter;