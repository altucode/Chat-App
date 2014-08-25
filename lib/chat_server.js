var createChat = function (server) {
  var io = require('socket.io').listen(server);
  io.sockets.on('connection', function (socket) {
    socket.emit("message", { text: "some text." });
    socket.on("message", function (data) {
      console.log(data);
    });
  });
};

module.exports = createChat;

