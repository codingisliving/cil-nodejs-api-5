const env = require('dotenv').config().parsed;
const config = {
    app: {
        host: env.APP_HOST,
        port: env.APP_PORT,
        auth: {
            key: env.AUTH_KEY,
            expiry: env.AUTH_EXPIRY
        },
        bcrypt: {
            saltRounds: parseInt(env.SALT_ROUNDS)
        }
    },
    db: {
        host: env.DB_HOST,
        name: env.DB_NAME,
        collections: {
            user: env.DB_COLLECTION_USERS
        }
    },
    redis: {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        expiry: env.REDIS_EXPIRY_SECS
    }
};

module.exports = config;
