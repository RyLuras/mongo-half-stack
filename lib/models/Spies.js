const db = require('../mongo-connection');
const { ObjectId } = require('mongodb');

class Spies {
    constructor() {
        this.spies = new Map();
    }

    get(id) {
        return db('spies')
            .then(collection => collection.findOne({ _id: ObjectId(id) }));
    }

    getAll(query) {
        return db('spies')
            .then(collection => collection.find(query)) //cleanse the input?
            .then(spiesDocObject => spiesDocObject.toArray());
    }

    create(data) {
        return db('spies')
            .then(collection => {
                return collection.insertOne({
                    name: data.name,
                    weapon: data.weapon,
                    vehicle: data.vehicle
                });
            })
            .then(result => result.ops[0]);
    }

    update(id, data) {
        return db('spies')
            .then(collection => {
                return collection.findOneAndUpdate(
                    { _id: ObjectId(id) }, 
                    {
                        $set: {
                            weapon: data.weapon,
                            vehicle: data.vehicle
                        }
                    },
                    { returnOriginal: false }
                );
            })
            .then(result => result.value);
    }

    delete(id) {
        return db('spies')
            .then(collection => collection.findOneAndDelete({ _id: ObjectId(id) }))
            .then(result => result.value);
    }

    drop() {
        return db('spies').then(collection => collection.deleteMany());
    }
}

module.exports = new Spies();
