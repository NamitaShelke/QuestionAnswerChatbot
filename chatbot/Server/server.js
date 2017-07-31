var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var QA = require('./process.js')
var conf = require('./conf.js')
app.use(express.static(path.join(__dirname)));

app.get('/', function(req, res){
	
  res.sendFile(path.join(__dirname,'../Client','chatbot.html'));
});

io.on('connection', function(socket){
  console.log('A user connected');


  socket.on('send_question', function (user,question) {
    ret = QA.processRequest(user,question,function(data)
    {
    	console.log(data)
    	io.emit('send_answer', data);

    });
    
  });
 
  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });

});

http.listen(3001, function(){
  console.log('listening on *:3001');
});