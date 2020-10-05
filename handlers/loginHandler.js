const bcrypt = require('bcrypt');
const authUtils = require('../authUtils');

const createLoginHandler = (context) => {
    const { mongoDbConnector, collection, config } = context;

    return async (req, res) => {
        const { username, password } = req.body;
        if (username && password) {
            const result = await mongoDbConnector.findOne(
                collection,
                { username }
            );

            let verifyPass = false;
            if (result.password) {
                verifyPass = await bcrypt.compare(password, result.password);
            }

            if (verifyPass) {
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
    }
};

module.exports = createLoginHandler;
