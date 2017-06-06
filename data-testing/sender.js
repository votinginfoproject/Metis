var config = require('../config');
var logger = (require('../logging/vip-winston')).Logger;
var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');
var messageContent = require('./content');
var stormpathREST = require('stormpath');

if(config.auth.uselocalauth()) {
  logger.info('Stormpath credentials are not set!');
} else {
  var stormpathRESTApiKey = new stormpathREST.ApiKey(config.auth.apiKey, config.auth.apiKeySecret);
  var stormpathRESTClient = new stormpathREST.Client({ apiKey: stormpathRESTApiKey });
}

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
//   transporter.sendMail(messageContent, function(error, info) {
//     if (error) {
//       logger.info('Sending error: ' + error);
//       logger.info('Message: ' + JSON.stringify(messageContent));
//     }
//   });
  logger.info("fake sending something!" + messageContent.toString())
};

var notifyGroup = function(message, groupName, contentFn) {
  if (message["adminEmail"] == true) { groupName = config.email.adminGroup; }
  stormpathRESTClient.getGroups({ name: groupName }, function(err, groups) {
    if (err) throw err;
    groups.each(function(group) {

      group.getAccounts(function(err, accounts) {
        if (err) throw err;

        for( i = 0; i < accounts.items.length; i++ ) {
          var recipient = accounts.items[i];
          var messageContent = contentFn(message, recipient);

          sendMessage(messageContent);
        }
      });
    });
  });
};

module.exports = {
  sendNotifications: function(message) {
    if(config.auth.uselocalauth()) {
      logger.warning('A message was trying to be sent but cannot be Stormpath \
                      credentials are not set! Message: ' + message);
    } else {
      var messageType;
      if (message['status'] == "ok") {
        messageType = messageOptions.testingComplete;
      } else {
        messageType = messageOptions.errorDuringTesting;
      };
      if (message['group']) {
            notifyGroup(message, message['group'], messageType);
      } else {
            notifyGroup(message, config.email.adminGroup, messageType);
      }
    }
  }
};
