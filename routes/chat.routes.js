var express = require('express');
const router = express.Router();
var Chat = require('../models/Chats');

//http: //localhost:3000/chats
router.get('/', function(req, res) {
    Chat.find((err, data) => {
        if (err) throw err;
        res.send(data);
    })
});

router.post('/', (req, res) => {
    Chat.create(req.body, (err) => {
        if (err) throw err;
        res.send('Chat Saved');
    })
});

module.exports = router;