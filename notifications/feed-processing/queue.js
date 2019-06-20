var logger = (require('../../logging/vip-winston')).Logger;
var config = require('../../config');
var edn = require("jsedn");
var sender = require('./../sender');

module.exports = {
  processSuccessMessage: function(message) {
    logger.info("Received raw message: " + JSON.stringify(message));
    var rabbitMessage = edn.toJS(edn.parse(message.Body));
    logger.info("Received: " + JSON.stringify(rabbitMessage));
    sender.sendFeedProcessingSuccessNotifications(rabbitMessage, 'processedFeed');
  },
  processFailureMessage: function(message) {
    logger.info("Received raw message: " + JSON.stringify(message));
    var rabbitMessage = edn.toJS(edn.parse(message.Body));
    logger.info("Received: " + JSON.stringify(rabbitMessage));
    sender.sendFeedProcessingFailureNotifications(rabbitMessage, 'processedFeed');
  }
}
