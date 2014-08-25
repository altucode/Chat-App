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
  var usersByRoom = {};
  var clients = {};

  var onConnect = function(socket) {
    setRoom(socket, 0);
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
    unsetRoom(socket);
    delete nicknames[socket.id];
    clients.remove(socket.id);
  };

  var getRoom = function (socket) {
    return currentRooms[socket.id] = currentRooms[socket.id] || socket.rooms[socket.rooms.length - 1];
  };

  var addToRoom = function (socket, room) {
    (usersByRoom[room] = usersByRoom[room] || []).push(socket.id);
  };

  var removeFromRoom = function (socket, room) {
    if (usersByRoom[room]) {
      var i = usersByRoom[room].indexOf(socket.id);
      if (i !== -1) {
        usersByRoom[room].splice(i, 1);
      }
    }
    delete currentRooms[socket.id];
  };

  var getNamesInRoom = function (room) {
    if (usersByRoom[room]) {
      return usersByRoom[room].map(function (id) {
        return nicknames[id];
      });
    }
    return [];
  };

  var setRoom = function (socket, room) {
    console.log(getNamesInRoom(room));
    unsetRoom(socket);
    addToRoom(socket, room);
    socket.join(currentRooms[socket.id] = room);
    sendAll(socket, { text: nicknames[socket.id] + " has joined the room."});
    io.sockets.in(room).emit("roomChangeEvent", { users: getNamesInRoom(room) })
  };

  var unsetRoom = function (socket) {
    sendAll(socket, { text: nicknames[socket.id] + " has left the room."});
    if (socket.rooms.length) {
      socket.leave(socket.rooms[socket.rooms.length-1]);
    }
    var room = getRoom(socket);
    removeFromRoom(socket, room);
    io.sockets.in(room).emit("roomChangeEvent", { users: getNamesInRoom(room) })
  };

  var handleRoomChangeRequest = function (socket, data) {
    setRoom(socket, data.room);
  };

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
    io.sockets
      .in(getRoom(socket))
      .emit("message", message(data.text, nicknames[socket.id]));
  };

  var sendByRoom = function(room, message) {
  };

  function message(text, nick) {
    return { text: text, nickname: nick ? nick : "server" };
  };

  module.exports = createChat;
// })();

