const jwt = require('jsonwebtoken');

const verifyToken = (token, key) => {
    return jwt.verify(token, key);
};

const createToken = (key, data, expiry) => {
    return jwt.sign(data, key, {
        expiresIn: expiry
    });
};

module.exports = {
    verifyToken,
    createToken
};
