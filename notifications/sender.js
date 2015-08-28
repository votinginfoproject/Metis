var logger = (require('../logging/vip-winston')).Logger;
var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');
var messageContent = require('./content');

var transporter = nodemailer.createTransport(sesTransport({
  accessKeyId: process.env.VIP_DP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.VIP_DP_AWS_SECRET_KEY,
  rateLimit: 5,
  region: process.env.VIP_DP_SES_REGION
}))

module.exports = {
  messageOptions: {
    processedFeed: function(recipient, message) {
      return {
        from: process.env.VIP_DP_SES_FROM,
        to: recipient,
        subject: 'Your Feed Has Been Processed',
        text: messageContent.processedFeed(message)
      }
    }
  },
  sendMessage: function(messageContent) {
    transporter.sendMail(messageContent, function(error, info) {
      error ? logger.info('Sending error: ' + error) : logger.info('Message sent: ' + info);
    });
  }
}