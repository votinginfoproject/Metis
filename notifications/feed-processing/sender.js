var config = require('../../config');
var logger = (require('../../logging/vip-winston')).Logger;
var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');
var messageContent = require('./content');
var pg = require('pg');
var authService = require("../../authentication/services");
var notify = require("../sender.js")

var transporter = nodemailer.createTransport(sesTransport({
  accessKeyId: config.aws.accessKey,
  secretAccessKey: config.aws.secretKey,
  rateLimit: config.email.rateLimit,
  region: config.aws.region
}));

var messageOptions = {
  approveFeed: function(message, recipient, group) {
    return {
      from: config.email.fromAddress,
      to: recipient.email,
      subject: "A Feed has been Approved",
      html: messageContent.approveFeed(message, recipient, group)
    }
  },
  processedFeed: function(message, recipient, group) {
    return {
      from: config.email.fromAddress,
      to: recipient.email,
      subject: 'Your Feed Has Been Processed',
      html: messageContent.processedFeed(message, recipient, group)
    };
  },
  v5processedFeed: function(message, recipient, group) {
    return {
      from: config.email.fromAddress,
      to: recipient.email,
      subject: 'Your Feed Has Been Processed',
      html: messageContent.v5processedFeed(message, recipient, group)
    };
  },
  errorDuringProcessing: function(message, recipient) {
    return {
      from: config.email.fromAddress,
      to: recipient.email,
      subject: 'Something Went Wrong with a Feed',
      text: messageContent.errorDuringProcessing(message)
    };
  }
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
  sendNotifications: function(message, messageType) {
    var vip_id_query = "SELECT vip_id, spec_version \
                        FROM results \
                        WHERE public_id = $1";

    var publicId = message[":public-id"];

    if (!publicId) {
      logger.error('No Public ID listed.');
      notify.sendEmail(message, config.email.adminGroup, messageOptions.errorDuringProcessing);
    } else {
      pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if (err) return logger.error('Could not connect to PostgreSQL. Error fetching client from pool: ', err);

        client.query(vip_id_query, [publicId], function(err, result) {
          done();

          if (err || result.rows.length == 0) {
            logger.error('No feed found or connection issue.');
            notify.sendEmail(message, config.email.adminGroup, messageOptions.errorDuringProcessing);
          } else {

            var vip_id = result.rows[0]['vip_id'];
            var spec_version = new String(result.rows[0]['spec_version']);
            if (vip_id && spec_version[0] == '5'  && messageType === 'processedFeed') {
              notify.sendEmail(message, vip_id, messageOptions['v5processedFeed']);
            } else {
              notify.sendEmail(message, vip_id, messageOptions[messageType]);
            }
          }
        });
      });
    }
  }
};
