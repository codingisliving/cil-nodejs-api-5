const createGetUserListHandler = (context) => {
    const { mongoDbConnector, collection } = context;

    return async (req, res) => {
        const result = await mongoDbConnector.find(collection, {});
        res.send(result);
    }
};

module.exports = createGetUserListHandler;
