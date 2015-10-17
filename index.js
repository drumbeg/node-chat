var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var people = {};

app.get('/', function (req, res) {
   res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
   people[socket.id] = 'Guest';
   io.emit('print', 'A guest has connected');
   io.emit('update online list', people);

   socket.on('disconnect', function () {
      io.emit('print', people[socket.id] + ' has disconnected');
      delete people[socket.id];
      io.emit('update online list', people);
   });

   socket.on('chat message', function (msg) {
      io.emit('print', people[socket.id] + ' says: ' + msg);
   });

   socket.on('set nick', function (name) {
      io.emit('print', (people[socket.id] || 'Guest') + ' is now called ' + name);
      people[socket.id] = name;
      io.emit('update online list', people);
   });
});

http.listen(3000, function () {
   console.log('listening on *:3000');
});