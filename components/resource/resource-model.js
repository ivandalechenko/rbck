const { Schema, model } = require('mongoose');

const ResourceSchema = new Schema({
    name: String,
    level: Number,
    price: Number,
    weight: Number,
    canMineLevel: [{
        canMineLevel: Number,
        _id: Schema.Types.ObjectId,
        luckLevel: [{
            luckLevel: Number,
            percent: Number,
            _id: Schema.Types.ObjectId
        }]
    }]
})

module.exports = model('Resource', ResourceSchema);
