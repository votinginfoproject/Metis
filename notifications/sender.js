var logger = (require('../logging/vip-winston')).Logger;
var authService = require("../authentication/services");
var config = require('../config');
var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');
var dataTestingMessageContent = require('./data-testing/content');
var feedProcessingMessageContent = require('./feed-processing/content');
var pg = require('pg');
var slack = require('./slack');

var transporter = nodemailer.createTransport(sesTransport({
  accessKeyId: config.aws.accessKey,
  secretAccessKey: config.aws.secretKey,
  rateLimit: config.email.rateLimit,
  region: config.aws.region
}));

var dataCentralizationOnly = function(user) {
  return user.app_metadata.roles &&
         user.app_metadata.roles.length == 1 &&
         user.app_metadata.roles[0] == 'data-centralization';
};

var messageOptions = {
  // data-testing message options
  testingComplete: function(message, recipient) {
    return {
      from: config.email.fromAddress,
      to: recipient.email,
      subject: "A batch address test has completed",
      html: dataTestingMessageContent.testingComplete(message)
    }
  },
  errorDuringTesting: function(message, recipient) {
    return {
      from: config.email.fromAddress,
      to: recipient.email,
      subject: "A batch address test has failed",
      html: dataTestingMessageContent.errorDuringTesting(message)
    }
  },

  // feed-processing message options
  approveFeed: function(message, recipient, fipsCode) {
    if (dataCentralizationOnly(recipient)) {
      return null;
    } else {
      return {
        from: config.email.fromAddress,
        to: recipient.email,
        subject: "A Feed has been Approved",
        html: feedProcessingMessageContent.approveFeed(message, recipient, fipsCode)
      }
    }
  },
  processedFeed: function(message, recipient, fipsCode) {
    if (dataCentralizationOnly(recipient)) {
      return null;
    } else {
      return {
        from: config.email.fromAddress,
        to: recipient.email,
        subject: 'Your Feed Has Been Processed',
        html: feedProcessingMessageContent.processedFeed(message, recipient, fipsCode)
      };
    }
  },
  v5processedFeed: function(message, recipient, fipsCode) {
    if (dataCentralizationOnly(recipient)){
      return null;
    } else {
      return {
        from: config.email.fromAddress,
        to: recipient.email,
        subject: 'Your Feed Has Been Processed',
        html: feedProcessingMessageContent.v5processedFeed(message, recipient, fipsCode)
      };
    }
  },
  errorDuringProcessing: function(message, recipient) {
    if (dataCentralizationOnly(recipient)) {
      return null;
    } else {
      return {
        from: config.email.fromAddress,
        to: recipient.email,
        subject: 'Something Went Wrong with a Feed',
        text: feedProcessingMessageContent.errorDuringProcessing(message)
      };
    }
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

var badFips = function(fips) {
  if ((typeof fips != "string") ||
       (fips.length < 2) ||
       (fips.length > 5)) {
    return true;
  } else {
    return false;
  }
}

var sendEmail = function(message, fips, contentFn) {
  authService.getUsersByFips(fips, function (users) {
    for (var i = 0; i < users.length; i++) {
      var recipient = users[i];
      var messageContent = contentFn(message, recipient, fips);

      if (messageContent != null) {
        sendMessage(messageContent);
        logger.info("Sending a message to: " + messageContent.to + " with this subject: " + messageContent.subject);
      }
    };
  });
};

var loadFeed = function(publicId, callback) {
  var vip_id_query = "SELECT vip_id, spec_version, election_date, extract(epoch from (end_time - start_time)) as duration \
                      FROM results \
                      WHERE public_id = $1";

  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err) return logger.error('Could not connect to PostgreSQL. Error fetching client from pool: ', err);

    client.query(vip_id_query, [publicId], function(err, result) {
      done();

      if (err || result.rows.length == 0) {
        logger.error('No feed found or connection issue.');
        slack.message("ERROR: No feed found matching public_id in database (public_id follows):\n" + publicId);
      } else {
        callback(result);
      }
    });
  });
}

module.exports = {
  sendFeedProcessingSuccessNotifications: function(message, messageType) {
    loadFeed(message.publicId, (result) => {
      var fips = result.rows[0]['vip_id'];
      var spec_version = new String(result.rows[0]['spec_version']);
      var stateName = feedProcessingMessageContent.codeToDescription(fips.slice(0,2));
      var electionDate = result.rows[0]['election_date'] || "Not available";
      var duration = result.rows[0]['duration'] || "Not available";

      slack.message("SUCCESS: Feed processed for FIPS " + fips +
                    "\nState Name " + stateName +
                    "\nElection Date " + electionDate +
                    "\nVIP Spec Version " + spec_version +
                    "\nProcessing-Time (sec) " + duration);
      if (fips && spec_version[0] == '5'  && messageType === 'processedFeed') {
        sendEmail(message, fips, messageOptions['v5processedFeed']);
      } else {
        sendEmail(message, fips, messageOptions[messageType]);
      }});
  },
  sendFeedProcessingFailureNotifications: function(message, messageType) {
    var publicId = message.publicId;

    if (!publicId) {
      logger.error('No Public ID listed.');
      slack.message("ERROR: Feed processed but no public id found (message follows):\n" +
                    JSON.stringify(message));
    } else {
      loadFeed(publicId, (result) => {
        var fips = result.rows[0]['vip_id'];
        var spec_version = new String(result.rows[0]['spec_version']);
        if (badFips(fips)) {
          slack.message("ERROR: Feed processed but FIPS was bad, no notifications sent: " + fips);
        } else {
          var stateName = feedProcessingMessageContent.codeToDescription(fips.slice(0,2));
          var electionDate = result.rows[0]['election_date'] || "Not available";
          slack.message("EXCEPTION: Feed processed with errors for FIPS " + fips +
                        "\nState Name " + stateName +
                        "\nElection Date " + electionDate +
                        "\nVIP Spec Version " + spec_version +
                        "\nProcessed Message " + JSON.stringify(message));
        }
        if (fips && spec_version[0] == '5'  && messageType === 'processedFeed') {
          sendEmail(message, fips, messageOptions['v5processedFeed']);
        } else {
          sendEmail(message, fips, messageOptions[messageType]);
        }
      });
    }
  },
  sendAddressTestSuccessNotifications: function(message) {
    var fipsCode = message.fipsCode;
    var slackMessage = "";
    if(fipsCode == "undefined") {
      slackMessage += "SUCCESS: Batch Address file processed for an admin, available at: " + message["url"];
    } else {
      slackMessage += "SUCCESS: Batch Address file processed for fips " + fipsCode + ", available at: " + message["url"];
    }
    if(message.stats) {
      slackMessage += "\nMatch Breakdown:";
      var statuses = ["Match", "Possible Mismatch", "Mismatch", "No Result"];
      statuses.map( (key) => { if (message.stats.hasOwnProperty(key)) {
                                 slackMessage += "\n" + key + ": " + message.stats[key];
                               } else {
                                 slackMessage += "\n" + key + ": 0";
                               } });
    }
    slack.message(slackMessage);
    sendEmail(message, fipsCode, messageOptions['testingComplete']);
  },
  sendAddressTestFailureNotifications: function(message) {
    var fipsCode = message.fipsCode;
    if (fipsCode === undefined) {
      logger.warning("No fips code in batch-address.file.complete message.  Can't send batch address testing finished email notification.");
      slack.message("ERROR: Batch Address sent a message we don't understand: " +
                    JSON.stringify(message));
    } else if (fipsCode === "undefined") {
      slack.message("ERROR: Admin submitted Batch Address file FAILED (message follows):\n" +
                    JSON.stringify(message));
    } else if (badFips(fipsCode)) {
      slack.message("ERROR: Batch Address file processed but fips was bad, no emails sent (message follows)\n" +
                    JSON.stringify(message));
    } else {
      slack.message("ERROR: Batch Address file failed (message follows)\n" +
                    JSON.stringify(message));
      sendEmail(message, fipsCode, messageOptions['errorDuringTesting']);
    }
  }
};
