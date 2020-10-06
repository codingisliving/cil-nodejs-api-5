const MongoDbConnector = require('./mongoDbConnector');
const RedisConnector = require('./redisConnector');

const initMongoDb = (config) => {
    const mongoDbConnector = new MongoDbConnector({
        name: config.db.name,
        host: config.db.host
    });
    mongoDbConnector.connect();
    return mongoDbConnector;
}

const initRedis = (config) => {
    const redisConnector = new RedisConnector();
    redisConnector.connect(config.redis.host, config.redis.port);
    return redisConnector;
}

const initializeConnectors = (config) => ({
    mongoDbConnector: initMongoDb(config),
    redisConnector: initRedis(config)
});

module.exports = initializeConnectors;
