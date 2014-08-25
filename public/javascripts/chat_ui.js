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

var renderRoomUsers = function (data) {
  var list = $("<ul></ul>");
  data.users.forEach(function (user) {
    list.append($("<li></li>").text(user));
  });
  $(".user-list").html(list);
};

chat.socket.on("message", displayMessage);
chat.socket.on("roomChangeEvent", renderRoomUsers);

$(document).ready(function () {
  $("form").on("submit", sendMessage);
});

