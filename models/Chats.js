var mongoose = require('mongoose');

var chatSchema = mongoose.Schema({
    name: { type: String, required: true },
    chat: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model('Chat', chatSchema);