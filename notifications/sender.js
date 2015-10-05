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
  processedFeed: function(rabbitMessage, recipient, group) {
    return {
      from: config.email.fromAddress,
      to: recipient.email,
      subject: 'Your Feed Has Been Processed',
      html: messageContent.processedFeed(rabbitMessage, recipient, group)
    };
  },
  errorDuringProcessing: function(rabbitMessage, recipient) {
    return {
      from: config.email.fromAddress,
      to: recipient.email,
      subject: 'Something Went Wrong with a Feed',
      text: messageContent.errorDuringProcessing(rabbitMessage)
    };
  }
};

var sendMessage = function(messageContent) {
  transporter.sendMail(messageContent, function(error, info) {
     if (error) logger.info('Sending error: ' + error);
  });
};

var notifyGroup = function(rabbitMessage, vipId, contentFn) {
  stormpathRESTClient.getGroups({ name: vipId }, function(err, groups) {
    if (err) throw err;
    groups.each(function(group) {
      
      group.getAccounts(function(err, accounts) {
        if (err) throw err;

        for( i = 0; i < accounts.items.length; i++ ) {
          var recipient = accounts.items[i];
          var messageContent = contentFn(rabbitMessage, recipient, group);

          sendMessage(messageContent);
        }
      });
    });
  });
};

module.exports = {
  sendNotifications: function(rabbitMessage) {    
    if(config.auth.uselocalauth()) {
      logger.warning('A message was trying to be sent but cannot be Stormpath \
                      credentials are not set! Message: ' + 
                      JSON.stringify(rabbitMessage));
    }
    
    var publicId = rabbitMessage[":public-id"];
    if (!publicId) {
      logger.error('No Public ID listed.');
      notifyGroup(rabbitMessage, config.email.adminGroup, messageOptions.errorDuringProcessing);
    } else {
      pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if (err) return logger.error('Could not connect to PostgreSQL. Error fetching client from pool: ', err);
        
        client.query("SELECT vip_id FROM sources s INNER JOIN results r ON r.id = s.results_id WHERE r.public_id = $1", [publicId], function(err, result) {
          done();
          
          if (err || result.rows.length == 0) {
            logger.error('No feed found or connection issue.');
            notifyGroup(rabbitMessage, config.email.adminGroup, messageOptions.errorDuringProcessing);
          } else {
            notifyGroup(rabbitMessage, result.rows[0].vip_id, messageOptions.processedFeed);
          }
        });
      });
    }
  }
};