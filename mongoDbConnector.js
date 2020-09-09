const mongodb = require('mongodb');

class MongoDbConnector {
    constructor(config){
        Object.assign(this, { config });
    }

    connect(){
        const { host, name } = this.config;
        const options = {
            useUnifiedTopology: true,
            useNewUrlParser: true
        };

        mongodb.MongoClient.connect(host, options, (err, client) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Connected successfully to DB");
                const db = client.db(name);
                Object.assign(this, { db, client });
            }
        });
    }

    disconnect(){
        this.client.close();
        console.log("Disconnected DB successfully!");
    }

    async insertOne(collection, data){
        try {
            const res = await this.db.collection(collection).insertOne(data);
            const textRes = res.result.ok ?
                `Success insert data to collection ${collection}!`:
                `Failed insert data to collection ${collection}!`;
            console.log(textRes);
            return textRes;
        }
        catch(err) {
            throw err;
        }
    }

    async findOne(collection, filter) {
        try {
            const res = await this.db.collection(collection).findOne(filter);
            return res || 'Data not found.';
        }
        catch (err) {
            throw err;
        }
    }

    async find(collection, filter) {
        try {
            const res = await this.db.collection(collection).find(filter);
            return res.toArray();
        }
        catch (err) {
            throw err;
        }
    }

    async updateOne(collection, filter, data) {
        try {
            const res = await this.db.collection(collection).updateOne(filter, { $set: data });
            const { nModified, ok } = res.result;
            return nModified && ok ?
                'Successfully updated data' : 'Failed to update data';
        }
        catch (err) {
            throw err;
        }
    }

    async deleteOne(collection, filter) {
        try {
            const res = await this.db.collection(collection).deleteOne(filter);
            const { n, ok } = res.result;
            return n > 0 && ok ?
                'Successfully deleted data' : 'Failed to delete data';
        }
        catch (err) {
            throw err;
        }
    }
}

module.exports = MongoDbConnector;
