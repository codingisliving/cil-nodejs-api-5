const createAuthMiddleware = require('./authMiddleware');

const initializeMiddlewares = (context) => ({
    authMiddleware: createAuthMiddleware(context)
});

module.exports = initializeMiddlewares;
