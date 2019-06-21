var logger = (require('../../logging/vip-winston')).Logger;
var sender = require('./../sender');

module.exports = {
  processSuccessMessage: function(message) {
    logger.info("Received message: " + JSON.stringify(message));
    sender.sendAddressTestSuccessNotifications(JSON.parse(message.Body));
  },
  processFailureMessage: function(message) {
    logger.info("Received message: " + JSON.stringify(message));
    sender.sendAddressTestFailureNotifications(JSON.parse(message.Body));
  }
}
