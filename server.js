var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var User = require('./models/userModel');
var Chat = require('./models/Chats');
var chatFormat = require('./models/chatFormat');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//connect to mongodb
mongoose.connect("mongodb://localhost:27017/rapsdb", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('You are connected to the database'); })
    .catch((error) => { console.log(error); });

var usersRouter = require('./routes/user.routes');
var chatsRouter = require('./routes/chat.routes');

var usrname = '';

io.on('connection', (socket) => {
    console.log('Socket is Connected.');

    socket.on('chatRoom', ({ username, chatroomselect }) => {
        var UserchatRoom = '';

        if (chatroomselect === "1") {
            UserchatRoom = 'Master Minds';
        } else {
            UserchatRoom = 'Secret Society';
        }
        var Newuser = {
            UserName: username,
            ChatRoom: UserchatRoom,
            SocketID: socket.id,
        };

        console.log(Newuser);

        // save new user to database function call
        const user = SaveNewUser(Newuser);

        // join user to the chat room
        socket.join(user.ChatRoom);
        socket.emit('message', chatFormat(`Bot`, 'Welcome to Lets Chat'));

        // broadcast to everyone in the chatroom
        socket.broadcast.to(user.ChatRoom).emit('message', chatFormat('Bot', `${user.UserName} has joined`));

        //when a new message has been caught from the user
        socket.on('NewMessage', (message) => {
            io.to(user.ChatRoom).emit('message', chatFormat(user.UserName, message));
        });

        // when user disconnects
        socket.on('disconnect', () => {
            if (user) {
                io.to(user.ChatRoom).emit('message', chatFormat('Bot', `${user.UserName} has disconnected`));
                DeleteUser(user.SocketID);
            }
        });
    });
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/chats', chatsRouter);

http.listen(3000, () => {
    console.log('Server is listening on port 3000');
})

//function for saving new user to the database
function SaveNewUser(Newuser) {
    User.create(Newuser, (err, data) => {
        if (err) throw err;
        console.log(data);
    });
    return Newuser;
}

//function for deleting a user after disconneting
function DeleteUser(userid) {
    User.findOne({ SocketID: userid }, (err, user) => {
        User.findByIdAndDelete(user._id, (err, data) => {
            if (err) throw err;
            console.log("User Deleted");
        });
    })
}