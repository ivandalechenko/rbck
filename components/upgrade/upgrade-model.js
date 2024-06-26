const { Schema, model } = require('mongoose');

const UpgradeSchema = new Schema({
    slug: String,
    name: String,
    description: String,
    level: Number,
    price: Number,
    improve: [{
        name: String,
        value: Number,
        _id: Schema.Types.ObjectId
    }],
    requirement: [String],
});

module.exports = model('Upgrade', UpgradeSchema);