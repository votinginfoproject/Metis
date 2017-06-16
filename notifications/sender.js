var config = require('../config');
var logger = (require('../logging/vip-winston')).Logger;
var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');
var messageContent = require('./content');
var stormpathREST = require('stormpath');
var pg = require('pg');

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

var notifyGroup = function(message, groupName, contentFn) {
  if ((typeof groupName != "string") ||
       (groupName.length < 2) ||
       (groupName.length > 5)) {
    groupName = config.email.adminGroup;
  };
  if (message["adminEmail"] == true) { groupName = config.email.adminGroup; }
  stormpathRESTClient.getGroups({ name: groupName }, function(err, groups) {
    if (err) throw err;
    groups.each(function(group) {

      group.getAccounts(function(err, accounts) {
        if (err) throw err;

        for( i = 0; i < accounts.items.length; i++ ) {
          var recipient = accounts.items[i];
          var messageContent = contentFn(message, recipient, group);

          // sendMessage(messageContent);
          logger.info("I would be sending a message with this content: " + messageContent)
        }
      });
    });
  });
};

module.exports = {
  sendNotifications: function(message, messageType) {
    if(config.auth.uselocalauth()) {
      logger.warning('A message was trying to be sent but cannot be Stormpath \
                      credentials are not set! Message: ' +
                      JSON.stringify(message));
    }

    var vip_id_query = "SELECT vip_id, spec_version \
                        FROM results \
                        WHERE public_id = $1";

    var publicId = message[":public-id"];

    if (!publicId) {
      logger.error('No Public ID listed.');
      notifyGroup(message, config.email.adminGroup, messageOptions.errorDuringProcessing);
    } else {
      pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if (err) return logger.error('Could not connect to PostgreSQL. Error fetching client from pool: ', err);

        client.query(vip_id_query, [publicId], function(err, result) {
          done();
          logger.info(result);
          logger.info(result.rows[0]);

          if (err || result.rows.length == 0) {
            logger.error('No feed found or connection issue.');
            notifyGroup(message, config.email.adminGroup, messageOptions.errorDuringProcessing);
          } else {
            if (result.rows[0].vip_id && result.rows[0].spec_version && result.rows[0].spec_version.startsWith('5')  && messageType === 'processedFeed') {
              notifyGroup(message, result.rows[0].vip_id, messageOptions['v5processedFeed']);
            } else {
              notifyGroup(message, result.rows[0].vip_id, messageOptions[messageType]);
            }
          }
        });
      });
    }
  }
};
