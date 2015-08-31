var logger = (require('../logging/vip-winston')).Logger;
var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');
var messageContent = require('./content');
var stormpathREST = require('stormpath');
var pg = require('pg');

var stormpathRESTApiKey = new stormpathREST.ApiKey(
  process.env.STORMPATH_API_KEY_ID,
  process.env.STORMPATH_API_KEY_SECRET
);

var stormpathRESTClient = new stormpathREST.Client({ apiKey: stormpathRESTApiKey });

var transporter = nodemailer.createTransport(sesTransport({
  accessKeyId: process.env.VIP_DP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.VIP_DP_AWS_SECRET_KEY,
  rateLimit: 1,
  region: process.env.VIP_DP_SES_REGION
}))

var messageOptions = {
  processedFeed: function(recipient, rabbitMessage) {
    return {
      from: process.env.VIP_DP_SES_FROM,
      to: recipient,
      subject: 'Your Feed Has Been Processed',
      text: messageContent.processedFeed(rabbitMessage)
    };
  }
};

var sendMessage = function(messageContent) {
  transporter.sendMail(messageContent, function(error, info) {
    error ? logger.info('Sending error: ' + error) : logger.info('Message sent: ' + info);
  });
};



module.exports = {
  sendNotifications: function(rabbitMessage) {    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      if (err) return logger.error('Could not connect to PostgreSQL. Error fetching client from pool: ', err);
      var publicId = rabbitMessage[":public-id"]; // what if there's no public-id?
      
      client.query("SELECT vip_id FROM sources s INNER JOIN results r ON r.id = s.results_id WHERE r.public_id = $1", [publicId], function(err, result) {
        if (err) return console.error('error running query', err);
        // what if there's nothing in the database?
        stormpathRESTClient.getGroups({ name: result.rows[0].vip_id }, function(err, groups) {
          if (err) throw err;
          
          groups.each(function(group) {
            group.getAccounts(function(err, accounts) {
              if (err) throw err;
              // what if there are no accounts?
              for( i = 0; i < accounts.items.length; i++ ) {
                var email = accounts.items[i].email; // what if there's no email?
                var messageContent = messageOptions.processedFeed(email, rabbitMessage);

                sendMessage(messageContent);
              }
            });
          });
        });
        
        client.end();
      });
    });
  }
}