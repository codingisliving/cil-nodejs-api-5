const { verifyToken } = require('../utils/authUtils');

const createAuthMiddleware = (context) => {
    return async (req, res, next) => {
        const { auth } = req.headers;
        const { config } = context;

        try {
            verifyToken(auth, config.app.auth.key);
            next();
        }
        catch (err) {
            res.status(401).send(err);
        }

    }
}

module.exports = createAuthMiddleware;
