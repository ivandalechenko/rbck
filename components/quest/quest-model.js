const { Schema, model } = require('mongoose');

const QuestSchema = new Schema({
    slug: String,
    name: String,
    description: String,
    link: String,
    bounty: Number,
    daily: Boolean,
});

module.exports = model('Quest', QuestSchema);