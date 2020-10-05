const { ObjectId } = require('mongodb');

const createDeleteUserHandler = (context) => {
    const { mongoDbConnector, collection } = context;

    return async (req, res) => {
        const result = await mongoDbConnector.deleteOne(
            collection,
            { _id: ObjectId(req.params.id) }
        );
        res.send(result);
    }
};

module.exports = createDeleteUserHandler;
