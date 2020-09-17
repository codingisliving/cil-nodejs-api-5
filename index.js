const env = require('dotenv').config().parsed;
const config = {
    app: {
        host: env.APP_HOST,
        port: env.APP_PORT
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

app.use(bodyParser.json());

const mongoDbConnector = new MongoDbConnector({
    name: config.db.name,
    host: config.db.host
});
mongoDbConnector.connect();
const collection = config.db.collections.user;

const redisConnector = new RedisConnector();
redisConnector.connect(config.redis.host, config.redis.port);

app.post('/user', async (req, res) => {
    const result = await mongoDbConnector.insertOne(collection, req.body);
    res.send(result);
});

app.get('/user', async (req, res) => {
    const result = await mongoDbConnector.find(collection, {});
    res.send(result);
});

app.get('/user/:id', async (req, res) => {
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

app.patch('/user/:id', async (req, res) => {
   const result = await mongoDbConnector.updateOne(
       collection,
       { _id: ObjectId(req.params.id) },
       req.body
   );
   res.send(result);
});

app.delete('/user/:id', async (req, res) => {
    const result = await mongoDbConnector.deleteOne(
        collection,
        { _id: ObjectId(req.params.id) }
    );
    res.send(result);
});

app.post('/login', (req, res) => {
    res.send('LOGIN: POST /login, logged in as "' + req.body.username + '"');
});

app.post('/logout', (req, res) => {
    res.send('LOGOUT: POST /logout');
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
