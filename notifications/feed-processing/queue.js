var logger = (require('../../logging/vip-winston')).Logger;
var sender = require('./../sender');

module.exports = {
  processSuccessMessage: function(message) {
    logger.info("Received message: " + JSON.stringify(message));
    sender.sendFeedProcessingSuccessNotifications(JSON.parse(message.Body), 'processedFeed');
  },
  processFailureMessage: function(message) {
    logger.info("Received message: " + JSON.stringify(message));
    sender.sendFeedProcessingFailureNotifications(JSON.parse(message.Body), 'processedFeed');
  }
}
