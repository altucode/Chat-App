var chat = new ChatApp.Chat({ socket: io() });

var sendMessage = function (event) {
  event.preventDefault();
  var message = $(event.target).find("textarea").val();
  $(event.target).find("textarea").val("");
  $(".chat-log").append($("<li></li>").text(message));
  chat.sendMessage(message);
};

$(document).ready(function () {
  $("form").on("submit", sendMessage);
});

