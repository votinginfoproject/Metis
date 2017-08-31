var logger = (require('../logging/vip-winston')).Logger;
var config = require('../config');
var edn = require("jsedn");
var sender = require('./sender');

var logAndThrowPossibleError = function(err) {
  if (err !== null) {
    logger.error(err);
    throw err;
  }
}

var processMessage = function(message) {
  var rabbitMessage = edn.toJS(edn.parse(message.content.toString()));
  logger.info("Received: " + JSON.stringify(rabbitMessage));
  sender.sendNotifications(rabbitMessage, 'processedFeed');
}

var setupFeedProcessing = function(ch, exchange) {
  var processingComplete = config.notifications.topics.processingComplete;

  ch.assertQueue('dashboard.notifications.feed_processed', {}, function(err, ok) {
    logAndThrowPossibleError(err);

    var processedQueue = ok.queue;
    ch.bindQueue(processedQueue, exchange, processingComplete, {}, logAndThrowPossibleError);

    // TODO: Remove `noAck: true` option and only ack messages successfully handled
    ch.consume(processedQueue, processMessage, {noAck: true}, logAndThrowPossibleError);
  });
};

exports.setupFeedProcessing = setupFeedProcessing;
