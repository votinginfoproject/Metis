var logger = (require('../../logging/vip-winston')).Logger;
var config = require('../../config');
var edn = require("jsedn");
var sender = require('./../sender');

module.exports = {
  processSuccessMessage: function(message) {
    var rabbitMessage = edn.toJS(edn.parse(JSON.parse(message.Body)["Message"]));
    logger.info("Received: " + JSON.stringify(rabbitMessage));
    sender.sendAddressTestSuccessNotifications(rabbitMessage, 'processedFeed');
  },
  processFailureMessage: function(message) {
    var rabbitMessage = edn.toJS(edn.parse(JSON.parse(message.Body)["Message"]));
    logger.info("Received: " + JSON.stringify(rabbitMessage));
    sender.sendAddressTestFailureNotifications(rabbitMessage, 'processedFeed');
  }
}
