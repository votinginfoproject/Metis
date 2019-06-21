var logger = (require('../../logging/vip-winston')).Logger;
var sender = require('./../sender');

module.exports = {
  processSuccessMessage: function(message) {
    logger.info("Received message: " + JSON.stringify(message));
    sender.sendFeedProcessingSuccessNotifications(message.Body, 'processedFeed');
  },
  processFailureMessage: function(message) {
    logger.info("Received message: " + JSON.stringify(message));
    sender.sendFeedProcessingFailureNotifications(message.Body, 'processedFeed');
  }
}
