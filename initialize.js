const config = require('./config');
const MongoDbConnector = require('./mongoDbConnector');
const RedisConnector = require('./redisConnector');
const initializeMiddlewares = require('./middlewares/initializeMiddlewares');
const initializeHandlers = require('./handlers/initializeHandlers');

const initMongoDb = () => {
    const mongoDbConnector = new MongoDbConnector({
        name: config.db.name,
        host: config.db.host
    });
    mongoDbConnector.connect();
    return mongoDbConnector;
}

const initRedis = () => {
    const redisConnector = new RedisConnector();
    redisConnector.connect(config.redis.host, config.redis.port);
    return redisConnector;
}

const initialize = () => {
    const context = {
        mongoDbConnector: initMongoDb(),
        redisConnector: initRedis(),
        config,
        collection: config.db.collections.user
    };

    const middlewares = initializeMiddlewares(context);
    const handlers = initializeHandlers(context);
    Object.assign(context, { middlewares, handlers });

    return context;
}

module.exports = initialize;
