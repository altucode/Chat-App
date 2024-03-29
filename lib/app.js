var http = require('http'),
  static = require('node-static'),
  socketio = require('socket.io')(),
  createChat = require('./chat_server');

var file = new static.Server("./public");

var server = http.createServer(function (req, res) {
  req.addListener('end', function() {
    file.serve(req, res);
  }).resume();
});

server.listen(8000);

createChat(server);
//
// socketio.on('connection', function (socket) {
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });