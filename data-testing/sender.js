var config = require('../config');
var logger = (require('../logging/vip-winston')).Logger;
var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');
var messageContent = require('./content');

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

var notifyGroup = function(message, groupName, contentFn) {
  if ((typeof groupName != "string") ||
       (groupName.length < 2) ||
       (groupName.length > 5)) {
    logger.info("groupName is bad--sending to admin group");
    groupName = config.email.adminGroup;
  };
  if (message["adminEmail"] == true) { groupName = config.email.adminGroup; }
  // #TODO get recipients to email
  var recipient = accounts.items[i];
  var messageContent = contentFn(message, recipient, group);

  sendMessage(messageContent);
  logger.info("Sending a message to: " + messageContent.to + " with this subject: " + messageContent.subject);
};

module.exports = {
  sendNotifications: function(message) {
    // #TODO-auth need to confirm connected to authentication source
    if(config.auth.uselocalauth()) {
      logger.warning('A message was trying to be sent but cannot be \
                      credentials are not set! Message: ' + message);
    } else {
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
          notifyGroup(message, config.email.adminGroup, messageType);
        }
      } else {
        notifyGroup(message, groupName, messageType);
      }
    }
  }
};
