// module.exports = (function () {
//   if (typeof ChatApp === undefined) {
//     ChatApp = {};
//   }

  var createChat = function (server) {
    io = require('socket.io').listen(server);
    io.sockets.on('connection', onConnect);
    io.sockets.on('disconnection', onDisconnect);
  };

  var io;
  var guestNumber = 1;
  var nicknames = {};

  var onConnect = function(socket) {
    nicknames[socket.id] = "guest" + guestNumber++;
    socket.on("message", function (data) {
      sendAll(socket, data);
    });
    socket.on("nicknameChangeRequest", function (data) {
      changeNickname(socket, data);
    });
    io.sockets.emit("message", message(nicknames[socket.id] + " has joined the room."));
  }

  var onDisconnect = function(socket) {
    io.sockets.emit("userDisconnected", message(nicknames[socket.id] + " has left the room."));
    delete nicknames[socket.id];
  }

  var changeNickname = function (socket, data) {
    var values = Object.keys(nicknames).map(function(key) { return nicknames[key]; });
    if (values.indexOf(data.nick) !== -1) {
      socket.emit("message", message("name taken"));
    } else {
      nicknames[socket.id] = data.nick;
      socket.emit("message", message("name set to " + data.nick));
    }
  };

  var sendAll = function (socket, data) {
    io.sockets.emit("message", message(data.text, nicknames[socket.id]));
  };

  function message(text, nick) {
    return { text: text, nickname: nick ? nick : "server" };
  }

  module.exports = createChat;
// })();

