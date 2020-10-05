const initialize = require('./initialize');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const context = initialize();
const {
    mongoDbConnector,
    redisConnector,
    config,
    middlewares,
    handlers
} = context;

const { authMiddleware } = middlewares;
const {
    createUserHandler,
    getUserListHandler,
    getUserHandler,
    updateUserHandler,
    deleteUserHandler,
    loginHandler
} = handlers;

app.post('/user', authMiddleware, createUserHandler);
app.get('/user', authMiddleware, getUserListHandler);
app.get('/user/:id', authMiddleware, getUserHandler);
app.patch('/user/:id', authMiddleware, updateUserHandler);
app.delete('/user/:id', authMiddleware, deleteUserHandler);

app.post('/login', loginHandler);

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
