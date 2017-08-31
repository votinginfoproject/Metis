var logger = (require('../logging/vip-winston')).Logger;
var authService = require("../authentication/services");

var sendEmail = function(message, fips, contentFn) {
  if ((typeof fips != "string") ||
       (fips.length < 2) ||
       (fips.length > 5)) {
    logger.info("fips is bad--sending to admin group");
    fips = "admin";
  };
  if (message["adminEmail"] == true) { fips = "admin"; }
  authService.getUsersByFips(fips, function (users) {
    for (var i = 0; i < users.length; i++) {
      var recipient = users[i];
      var messageContent = contentFn(message, recipient, fips);

      sendMessage(messageContent);
      logger.info("Sending a message to: " + messageContent.to + " with this subject: " + messageContent.subject);
    };
  });
};
