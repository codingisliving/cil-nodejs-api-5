const { ObjectId } = require('mongodb');

const createGetUserHandler = (context) => {
    const {
        redisConnector,
        mongoDbConnector,
        collection,
        config
    } = context;

    return async (req, res) => {
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
    }
}

module.exports = createGetUserHandler;
