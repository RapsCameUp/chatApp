var express = require('express');
const router = express.Router();
var User = require('../models/userModel');

//http: //localhost:3000/users
router.get('/', function(req, res) {
    User.find((err, data) => {
        if (err) throw err;
        res.send(data);
    })
});

router.post('/', (req, res) => {
    User.create(req.body, (err) => {
        if (err) throw err;
        res.send('User Saved');
    })
});

router.post('/getUserById', function(req, res) {
    User.findOne({ SocketID: req.body.SocketID }, (err, user) => {
        if (err) throw err;
        if (!user) return res.status(404).send("User doesn't exist.");
        res.send(user);
    })
});

/*router.get('/:id', function(req, res) {
    console.log("show the id");
    console.log(req.body.id);
    User.findOne({ SocketID: req.body.id }, (err, user) => {
        if (err) throw err;
        if (!user) return res.status(404).send("User doesn't exist.");
        res.send(user);
    })
});*/

var getUserById = function(req, res, next) {
    User.find((err, data) => {
        if (err) throw err;
        for (i = 0; i < data.length; i++) {
            if (data[i].SocketID === req.params.id) {
                res.send(data[i]);
            }
        }
    })
}
router.get('/:id', getUserById);

router.delete('/:id', (req, res) => {

    User.findById(req.params.id, (err, data) => {
        if (err) throw err;
        if (!data)
            return res.status(404).send("User doesn't exist with given Id.");
        User.findByIdAndDelete(req.params.id, (err, data) => {
            if (err) throw err;
            res.send(data);
        });
    });
});

module.exports = router;