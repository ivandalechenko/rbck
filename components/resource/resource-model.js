const { Schema, model } = require('mongoose');

const ResourceSchema = new Schema({
    name: String,
    level: Number,
    price: Number,
    weight: Number,
    canMineLevel: [{
        canMineLevel: Number,
        luckLevel: [{
            luckLevel: Number,
            percent: Number
        }]
    }]
})

module.exports = model('Resource', ResourceSchema);
