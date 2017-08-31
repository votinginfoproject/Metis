var config = require('../../config');
var logger = (require('../../logging/vip-winston')).Logger;
var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');
var messageContent = require('./content');
var authService = require("../../authentication/services");
var notify = require("../sender.js")

var transporter = nodemailer.createTransport(sesTransport({
  accessKeyId: config.aws.accessKey,
  secretAccessKey: config.aws.secretKey,
  rateLimit: config.email.rateLimit,
  region: config.aws.region
}));

var messageOptions = {
  testingComplete: function(message, recipient) {
    return {
      from: config.email.fromAddress,
      to: recipient.email,
      subject: "A batch address test has completed",
      html: messageContent.testingComplete(message)
    }
  },
  errorDuringTesting: function(message, recipient) {
    return {
      from: config.email.fromAddress,
      to: recipient.email,
      subject: "A batch address test has failed",
      html: messageContent.errorDuringTesting(message)
    }
  },
};

var sendMessage = function(messageContent) {
  transporter.sendMail(messageContent, function(error, info) {
    if (error) {
      logger.info('Sending error: ' + error);
      logger.info('Message: ' + JSON.stringify(messageContent));
    }
  });
};

// var notifyGroup = function(message, fips, contentFn) {
//   if ((typeof fips != "string") ||
//        (fips.length < 2) ||
//        (fips.length > 5)) {
//     logger.info("fips is bad--sending to admin group");
//     fips = "admin";
//   };
//   if (message["adminEmail"] == true) { fips = "admin"; }
//   authService.getUsersByFips(fips, function (users) {
//     for (var i = 0; i < users.length; i++) {
//       var recipient = users[i];
//       var messageContent = contentFn(message, recipient, fips);
//
//       sendMessage(messageContent);
//       logger.info("Sending a message to: " + messageContent.to + " with this subject: " + messageContent.subject);
//     };
//   });
// };

module.exports = {
  sendNotifications: function(message) {
    var messageType  = (message['status'] == "ok") ? messageOptions['testingComplete'] : messageOptions['errorDuringTesting'] ;
    var groupName = message["groupName"];
    if (groupName === undefined) {
      logger.warning("No group in batch-address.file.complete message.  Can't send batch address testing finished email notification.");
      logger.info(message);
    } else if (groupName === "undefined") {
      if (config.email.adminGroup === undefined || config.email.adminGroup === null) {
        logger.warning("No admin group defined.  Can't send batch address testing finished email notification.");
        logger.info(message);
      } else {
        notify.sendEmail(message, config.email.adminGroup, messageType);
      }
    } else {
      notify.sendEmail(message, groupName, messageType);
    }
  }
};
