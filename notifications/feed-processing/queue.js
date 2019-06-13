var logger = (require('../../logging/vip-winston')).Logger;
var config = require('../../config');
var edn = require("jsedn");
var sender = require('./../sender');

module.exports = {
  processSuccessMessage: function(message) {
    var rabbitMessage = edn.toJS(edn.parse(message.Body.toString()));
    logger.info("Received: " + JSON.stringify(rabbitMessage));
    sender.sendFeedProcessingSuccessNotifications(rabbitMessage, 'processedFeed');
  },
  processFailureMessage: function(message) {
    var rabbitMessage = edn.toJS(edn.parse(message.Body.toString()));
    logger.info("Received: " + JSON.stringify(rabbitMessage));
    sender.sendFeedProcessingFailureNotifications(rabbitMessage, 'processedFeed');
  }
}
