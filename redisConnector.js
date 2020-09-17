const redis = require('redis');

class RedisConnector {
    constructor() {}

    connect(host, port) {
        const client = redis.createClient(port, host);

        client
            .on('ready', () => {
                console.log('Redis client is ready.');
            })
            .on('error', (err) => {
                console.log(`Redis Client Error: ${err}`);
            });

        Object.assign(this, { client });
    }

    disconnect() {
        if (this.client) {
            console.log('Closing Redis client...');
            this.client.quit(() => {
                console.log('Successfully closed redis client.');
            });
        }
        else {
            console.log('Redis Client do not exist!');
        }
    }

    async set(key, data, expiry) {
        return new Promise((resolve) => {
            this.client.set(key, JSON.stringify(data), 'EX', expiry, (err, reply) => {
                resolve(reply);
            });
        });
    }

    async get(key) {
        return new Promise((resolve) => {
            this.client.get(key, (error, result) => {
                if (result) {
                    resolve(JSON.parse(result));
                }
                resolve(null);
            });
        });
    }
}

module.exports = RedisConnector;
