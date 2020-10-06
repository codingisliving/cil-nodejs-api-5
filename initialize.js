const config = require('./config');
const initializeConnectors = require('./connectors/initializeConnectors');
const initializeMiddlewares = require('./middlewares/initializeMiddlewares');
const initializeHandlers = require('./handlers/initializeHandlers');

const initialize = () => {
    const connectors = initializeConnectors(config);
    const context = {
        ...connectors,
        config,
        collection: config.db.collections.user
    };

    const middlewares = initializeMiddlewares(context);
    const handlers = initializeHandlers(context);
    Object.assign(context, { middlewares, handlers });

    return context;
}

module.exports = initialize;
