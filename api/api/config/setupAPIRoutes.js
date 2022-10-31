
const AllRouters = require('../app/Routers/AllRouters');
const Authorize = require('../app/Middleware/Authorize.js');
const VerifyJWT = require('../app/Middleware/VerifyJWT.js');

const KoaRouter = require('koa-router');


const testRouter = require('koa-router')({
    prefix: '/api'
});

testRouter.get('/', function (ctx) {
    console.log('router.get(/)');
    return ctx.body = 'test';
});


module.exports = function (app) {
    app.use(testRouter.routes());
    app.use(testRouter.allowedMethods());

    for(const router of AllRouters)
    {
        app.use(router.routes());
        app.use(router.allowedMethods());
    }
};
