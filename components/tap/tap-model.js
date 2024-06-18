const { Schema, model } = require('mongoose');

const TapSchema = new Schema({
    // userId: Ob,
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: String,
    price: Number,
})

module.exports = model('Tap', TapSchema);
