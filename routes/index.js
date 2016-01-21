var express = require('express');
var router = express.Router();
var net = require('net');

var booms = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
io.on('connection', function(socket){
  console.log('a user connected');
});
io.on('connection', function(socket){
  for(var i = 0; i < booms.length; i++){
    socket.emit('boom add', booms[i]);
  }
  socket.on('boom clicked', function(msg){
    console.log(msg);
    if(sockets[msg.authorId] != null){
      sockets[msg.authorId].write(msg.url + " was clicked\n");
    }
    else{
      console.log("author could not be found. bad entry.");
    }
  });
});

var sockets = [];
var draftBooms = [];

/*
 * Cleans the input of carriage return, newline
 */
function cleanInput(data) {
  return data.toString().replace(/(\r\n|\n|\r)/gm,"");
}

/*
 * Method executed when data is received from a socket
 */
function receiveData(socket, data) {
  var cleanData = cleanInput(data);
  if(cleanData === "@quit") {
    socket.end('Goodbye!\n');
  }
  else {
    for(var i = 0; i<draftBooms.length; i++) {
      if (draftBooms[i].socket == socket) {
        if(cleanData == "@send"){
          delete draftBooms[i].socket;
          draftBooms[i].author = {'id': socket.remoteAddress + ":" + socket.remotePort};
          console.log(draftBooms[i]);
          io.emit('boom add', draftBooms[i]);
          booms.push(draftBooms[i]);
          draftBooms.splice(i, 1);
        }
        else{
          var content = cleanData.split('=');
          if(content.length >= 2) {
            var param = content.shift();
            content = content.join("=");
            if (param != "socket") {
              draftBooms[i].boomData[param] = content;
            }
          }
        }
        return;
      }
    }
    draftBooms.push({socket: socket, boomData: {url: cleanData}});
  }
}

/*
 * Method executed when a socket ends
 */
function closeSocket(socket) {
  var key = socket.remoteAddress + ":" + socket.remotePort;
  for(var i = 0; i < booms.length; i++){
    if(booms[i].author.id == key){
      booms.splice(i, 1);
    }
  }
  io.emit('boom removeServer', {author: {id: key}});
  delete sockets[key];
}

/*
 * Callback method executed when a new TCP socket is opened.
 */
function newSocket(socket) {
  socket.key = socket.remoteAddress + ":" + socket.remotePort;
  console.log(socket.key);
  sockets[socket.key] = socket;
  sockets.push(socket);
  socket.write('Welcome to the Telnet server!\n');
  socket.on('data', function(data) {
    receiveData(socket, data);
  });
  socket.on('end', function() {
    closeSocket(socket);
  })
}

// Create a new server and provide a callback for when a connection occurs
var server = net.createServer(newSocket);

// Listen on port 8888
server.listen(8888);
module.exports = router;
