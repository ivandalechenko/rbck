const { Schema, model } = require('mongoose');

const QuestSchema = new Schema({
    name: String,
    description: String,
    bounty: Number,
    daily: Boolean,
});

module.exports = model('Quest', QuestSchema);