var dateHelper=new Date();
var https = require('https');
var express = require('express'),
    app = module.exports.app = express();
var fs = require('fs');
var sslOptions = {
  pfx: fs.readFileSync('./ce.pfx'),
     passphrase: "Anka1486!"
};

var server = https.createServer(sslOptions ,app);
var io = require('socket.io').listen(server);  
server.listen(2053); 

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/file.html');
});
io.sockets.on('connection', function (socket) {
	socket.on('addConversation', function(UniqueID){
		socket.room = "#"+UniqueID;
		socket.UniqueID = UniqueID;
		socket.join("#"+UniqueID);
	
	});
	socket.on('disconnect', function(){
		socket.leave(socket.room);
	});
	

	socket.on('sendMessage', function (msg, sendedMessageID, fileName, filePath, conversation) {
		for (var i = 0; i < conversation.Users.length; i++) {
		    io.sockets.in("#" + conversation.Users[i].UniqueID).emit('getMessage', socket.UniqueID, msg, conversation.UniqueID, sendedMessageID, fileName, filePath );
		}	
	});
	socket.on('typingMessage', function (user, conversation) {
	    for (var i = 0; i < conversation.Users.length; i++) {
	        if (conversation.Users[i].UniqueID != user.UniqueID) {
	            io.sockets.in("#" + conversation.Users[i].UniqueID).emit('getTypingMessage', socket.UniqueID, conversation.UniqueID, user);
	        }
	    }
	});
	socket.on('stopTypingMessage', function (user, conversation) {
	    for (var i = 0; i < conversation.Users.length; i++) {
	        if (conversation.Users[i].UniqueID != user.UniqueID) {
	            io.sockets.in("#" + conversation.Users[i].UniqueID).emit('getStopTypingMessage', socket.UniqueID, conversation.UniqueID, user);
	        }
	    }
	});

	socket.on('sendExtraInfo', function (user,conversation,extraInfo) {
	   /* for (var i = 0; i < conversation.Users.length; i++) {
	        if (conversation.Users[i].UniqueID != user.UniqueID) {
	            io.sockets.in("#" + conversation.Users[i].UniqueID).emit('getExtraInfo', socket.UniqueID, conversation.UniqueID, extraInfo);
	        }
	    } */
	});
    
});