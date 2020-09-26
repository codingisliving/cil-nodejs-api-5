const { verifyToken } = require('./authUtils');

const authMiddleware = (req, res, next) => {
    const { auth } = req.headers;
    const { config } = req.app;

    try {
        verifyToken(auth, config.app.auth.key);
        next();
    }
    catch (err) {
        res.status(401).send(err);
    }

};

module.exports = authMiddleware;
