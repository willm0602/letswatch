const AccountRouter = require('./AccountRouter')
const GroupRouter = require('./GroupRouter')
const MediaRouter = require('./MediaRouter')
const TMDBRouter = require('./TMDBRouter')
const WatchListRouter = require('./WatchListRouter')
const UserProfileEditsRouter = require('./UserProfileEditsRouter');

module.exports = [
    AccountRouter,
    GroupRouter,
    MediaRouter,
    TMDBRouter,
    WatchListRouter,
    UserProfileEditsRouter
]
