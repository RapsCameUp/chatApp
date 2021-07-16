var socket = io();

//get username and chatroom selected from the URL
const { username, chatroomselect } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

//emit the chatRoom event
socket.emit('chatRoom', { username, chatroomselect });

//emit the message even and display the message to the user
socket.on('message', (msg) => {
    console.log(msg);

    var getMsgsContainer = document.getElementById('divMessages');
    getMsgsContainer.scrollTop = getMsgsContainer.scrollHeight;
    ShowNewMessage(msg); // display in browser
})

//funciton for sending a message and emmiting an event, then save the message to the database
function SendAMessage() {
    var getMsg = document.getElementById('txtMessage').value;
    console.log(getMsg);
    var chatMessage = {
        name: username,
        chat: getMsg
    };
    console.log(getMsg);
    socket.emit('NewMessage', getMsg);

    document.getElementById('txtMessage').value = ''; // clear input box
    SaveMessageInDB(chatMessage); // save to database

}

//function for saving to the database
function SaveMessageInDB(chat) {
    $.post('http://localhost:3000/chats', chat)
}

//function for getting all the chats from the database
function getChats() {
    $.get('/chats', (chats) => {
        chats.forEach(ShowNewMessage);
    })
}

//function for displaying the message to the user
function ShowNewMessage(chatObj) {
    $('#divMessages').append(`<div class="row offset-sm-1 col-sm-10 card">
        <div class="card-body" style="background-color: #0d6efd;border-radius: 8px;margin-top:-30px;box-shadow: none;">
            <h6><b>${chatObj.UserName}:</b> ${chatObj.ChatMessage}</h6>
        </div>
    </div>`);
}

//function for logging a user out or disconnecting the user
function LogUserOut() {
    window.location.href = "/index.html";
}

//function for getting all the messages from the database
function getMessages() {
    $.get('/chats', (chats) => {
        chats.forEach(WriteToTextFile);
    })
}

//function for wring the messages in the chat room to the inputbox for later access  by the chat log download
function WriteToTextFile(obj) {
    var UserchatRoom = '';
    if (chatroomselect === "1") {
        UserchatRoom = 'Master Minds';
    } else {
        UserchatRoom = 'Secret Society';
    }
    if (obj.ChatRoom !== UserchatRoom) {} else {
        console.log(obj);
        $('#strInputBox').append(` ${obj.name}: ${obj.name} ` + "<br>");
    }
}

//function for downloading the file

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

//function for downloading the chat log
function DownloadChat() {
    getMessages();

    var getData = document.getElementById('strInputBox').value;
    console.log(getData);

    var text = getData;
    var filename = "chatlog.txt";

    download(filename, text);

}