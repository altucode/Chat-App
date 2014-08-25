(function() {
  if (typeof ChatApp === "undefined") {
    window.ChatApp = {};
  }

  var Chat = ChatApp.Chat = function Chat(attributes) {
    this.socket = attributes.socket;
  };

  Chat.prototype.sendMessage = function(message) {
    this.socket.emit('message', { text: message });
  };
})();