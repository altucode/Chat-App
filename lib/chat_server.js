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
  var currentRooms = {};
  var clients = {};

  var onConnect = function(socket) {
    nicknames[socket.id] = "guest" + guestNumber++;
    clients[socket.id] = socket;
    socket.on("message", function (data) {
      sendAll(socket, data);
    });
    socket.on("nicknameChangeRequest", function (data) {
      changeNickname(socket, data);
    });
    socket.on("roomChangeRequest", function (data) {
      handleRoomChangeRequest(socket, data);
    });
    io.sockets.emit("message", message(nicknames[socket.id] + " has joined the room."));
  };

  var onDisconnect = function(socket) {
    io.sockets.emit("userDisconnected", message(nicknames[socket.id] + " has left the room."));
    delete nicknames[socket.id];
    clients.remove(socket.id);
    leaveRoom(socket);
  };

  var getRoom = function (socket) {
    return currentUsers[socket.id] = currentUsers[socket.id] || socket.rooms[0];
  }

  var setRoom = function (socket, room) {
    if (socket.rooms.length) {
      socket.leave(socket.rooms[0]);
    }
    socket.join(currentUsers[socket.id] = room);
  }

  var joinRoom = function (socket, room) {
    currentRooms[socket.id] = room;
    socket.join(room);
    sendAll(socket, { message: nicknames[socket.id] + " has joined the room."});
  };

  var leaveRoom = function (socket) {
    socket.rooms.pop();
    if (currentRooms[socket.id]) {
      sendAll(socket, { message: nicknames[socket.id] + " has left the room."});
      socket.leave(currentRooms[socket.id]);
      currentRooms[socket.id] = -1;
    }
  };

  var handleRoomChangeRequest = function (socket, data) {
    leaveRoom(socket);
    joinRoom(socket, data.room);
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
    console.log("socket id: " + socket.id, ", socket room: " + currentRooms[socket.id]);
    console.log("socket id: " + socket.id, ", socket roomb: " + socket.rooms[0]);
    console.log("socket rooms: [" + socket.rooms + "]");
    io.sockets
      .in(currentRooms[socket.id])
      .emit("message", message(data.text, nicknames[socket.id]));
  };

  var sendByRoom = function(room, message) {
  };

  function message(text, nick) {
    return { text: text, nickname: nick ? nick : "server" };
  };

  module.exports = createChat;
// })();

