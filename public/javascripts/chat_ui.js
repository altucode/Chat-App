var chat = new ChatApp.Chat({ socket: io() });

var sendMessage = function (event) {
  event.preventDefault();
  var message = $(event.target).find("textarea").val();
  $(event.target).find("textarea").val("");
  chat.sendMessage(message);
};

var displayMessage = function (message) {
  $(".chat-log").append($("<li></li>").text(message.nickname + ": " + message.text));
};


chat.socket.on("message", displayMessage);

$(document).ready(function () {
  $("form").on("submit", sendMessage);
});

