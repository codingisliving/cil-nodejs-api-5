const env = require('dotenv').config().parsed;
const config = {
    app: {
        host: env.APP_HOST,
        port: env.APP_PORT,
        auth: {
            key: env.AUTH_KEY,
            expiry: env.AUTH_EXPIRY
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

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoDbConnector = require('./mongoDbConnector');
const RedisConnector = require('./redisConnector');
const { ObjectId } = require('mongodb');
const authMiddleware = require('./authMiddleware');
const authUtils = require('./authUtils');

app.use(bodyParser.json());

const mongoDbConnector = new MongoDbConnector({
    name: config.db.name,
    host: config.db.host
});
mongoDbConnector.connect();
const collection = config.db.collections.user;

const redisConnector = new RedisConnector();
redisConnector.connect(config.redis.host, config.redis.port);

const configMiddleware = async (req, res, next) => {
    Object.assign(req.app, { config });
    next();
};

app.post('/user',
    configMiddleware,
    authMiddleware,
    async (req, res) => {
    const result = await mongoDbConnector.insertOne(collection, req.body);
    res.send(result);
});

app.get('/user',
    configMiddleware,
    authMiddleware,
    async (req, res) => {
        const result = await mongoDbConnector.find(collection, {});
        res.send(result);
    }
);

app.get('/user/:id',
    configMiddleware,
    authMiddleware,
    async (req, res) => {
    let result = await redisConnector.get(req.params.id);
    console.log('Data from redis:', result);

    if (!result) {
        console.log('Failed getting data from redis, getting data from DB...');
        result = await mongoDbConnector.findOne(collection, {
            _id: ObjectId(req.params.id)
        });

        console.log('Data from DB:', result);
        if (result !== 'Data not found.') {
            const redisSetResult = await redisConnector.set(req.params.id, result, config.redis.expiry);
            console.log('Set Redis result:', redisSetResult);
        }
    }
    res.send(result);
});

app.patch('/user/:id',
    configMiddleware,
    authMiddleware,
    async (req, res) => {
   const result = await mongoDbConnector.updateOne(
       collection,
       { _id: ObjectId(req.params.id) },
       req.body
   );
   res.send(result);
});

app.delete('/user/:id',
    configMiddleware,
    authMiddleware,
    async (req, res) => {
    const result = await mongoDbConnector.deleteOne(
        collection,
        { _id: ObjectId(req.params.id) }
    );
    res.send(result);
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        const result = await mongoDbConnector.findOne(
            collection,
            { username, password }
        );

        if (result !== 'Data not found.') {
            const { auth } = config.app;
            const update = await mongoDbConnector.updateOne(
                collection,
                { username, password },
                { lastLogin: new Date() }
            );
            const token = authUtils.createToken(auth.key, { username, password }, auth.expiry);
            res.send({
                status: 'success',
                message: `Logged as ${username}`,
                token
            });
        }
        else {
            res.send({
                status: 'error',
                message: 'Wrong username or password!'
            });
        }
    }
    else {
        res.send({
            status: 'error',
            message: 'Username or password field is missing!'
        });
    }
});

app.post('/logout', (req, res) => {
    res.send('Logged out successfully!');
});

app.listen(config.app.port, () => {
    console.log(`cli-nodejs-api listening at http://${config.app.host}:${config.app.port}`)
});

['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, async () => {
        console.log("Stop signal received");
        mongoDbConnector.disconnect();
        redisConnector.disconnect();
        console.log("Exiting now, bye!");
        process.exit(0);
    });
});
