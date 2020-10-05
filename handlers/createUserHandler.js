const bcrypt = require('bcrypt');

const createCreateUserHandler = (context) => {
    const { mongoDbConnector, config, collection } = context;

    return async (req, res) => {
        const payload = { ...req.body };
        const { saltRounds } = config.app.bcrypt;
        payload.password = await bcrypt.hash(payload.password, saltRounds);

        const result = await mongoDbConnector.insertOne(collection, payload);
        res.send(result);
    }
}

module.exports = createCreateUserHandler;
