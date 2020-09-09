const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const MongoDbConnector = require('./mongoDbConnector');
const { ObjectId } = require('mongodb');

const mongoDbConnector = new MongoDbConnector({
    name: 'cil-rest-api',
    host: 'mongodb://localhost:27017'
});
mongoDbConnector.connect();
const collection = 'cil-users';

app.use(bodyParser.json());

app.post('/user', async (req, res) => {
    const result = await mongoDbConnector.insertOne(collection, req.body);
    res.send(result);
});

app.get('/user', async (req, res) => {
    const result = await mongoDbConnector.find(collection, {});
    res.send(result);
});

app.get('/user/:id', async (req, res) => {
    const result = await mongoDbConnector.findOne(collection, {
        _id: ObjectId(req.params.id)
    });
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

app.listen(port, () => {
    console.log(`cli-nodejs-api listening at http://localhost:${port}`)
});

['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, async () => {
        console.log("Stop signal received");
        mongoDbConnector.disconnect();
        console.log("Exiting now, bye!");
        process.exit(0);
    });
});
