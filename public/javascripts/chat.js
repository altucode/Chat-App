(function() {
  if (typeof ChatApp === "undefined") {
    window.ChatApp = {};
  }

  var Chat = ChatApp.Chat = function Chat(attributes) {
    this.socket = attributes.socket;
  };

  Chat.prototype.sendMessage = function(message) {
    if (message[0] === '/') {
      this.parseCommand(message.slice(1));
    } else  {
      this.socket.emit('message', { text: message });
    }
  };

  Chat.prototype.parseCommand = function(input) {
    var params = input.split(' ');
    switch(params[0]) {
    case "nick":
        this.socket.emit('nicknameChangeRequest', { nick: params[1] })
        break;
    default:
    };
  };
})();