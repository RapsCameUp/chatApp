var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    UserName: { type: String, required: true },
    SocketID: { type: String, required: true },
    ChatRoom: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model('User', userSchema);