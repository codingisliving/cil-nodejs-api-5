const { ObjectId } = require('mongodb');

const createUpdateUserHandler = (context) => {
    const { mongoDbConnector, collection } = context;

    return async (req, res) => {
        const result = await mongoDbConnector.updateOne(
            collection,
            { _id: ObjectId(req.params.id) },
            req.body
        );
        res.send(result);
    }
};

module.exports = createUpdateUserHandler;
