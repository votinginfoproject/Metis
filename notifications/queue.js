var logger = (require('../logging/vip-winston')).Logger;
var ampq = require('amqplib/callback_api');
var config = require('../config');
var edn = require("jsedn");

var connection = null;
var attempt = 0;

// on consume callback
// on message receive callback
// on channel open callback (to assert queue)

var logAndThrowPossibleError = function(err) {
  if (err !== null) {
    logger.error(err);
    throw err;
  }
}

var processMessage = function(message) {
  logger.info("Received: " + JSON.stringify(edn.toJS(edn.parse(message.content.toString()))));
}

var onChannelOpen = function(err, ch) {
  logAndThrowPossibleError(err);

  var ex = config.notifications.exchange;
  var exOptions = config.notifications.exchangeOptions;
  var processingComplete = config.notifications.topics.processingComplete;

  ch.assertExchange(ex, "topic", exOptions);
  ch.assertQueue('', {exclusive: true}, function(err, ok) {
    logAndThrowPossibleError(err);

    var queue = ok.queue;
    ch.bindQueue(queue, ex, processingComplete, {}, logAndThrowPossibleError);

    ch.consume(queue, processMessage, {}, logAndThrowPossibleError);
  });
};

var onConnect = function(err, conn) {
  if (err !== null) {
    logger.warn("Connection to RabbitMQ failed.");
    setTimeout(connect, attempt * 1000);
  } else {
    connection = conn;
    logger.info("Connected to RabbitMQ");
    connection.createChannel(onChannelOpen);
  }
};

var url = 'amqp:' + config.notifications.host + ":" + config.notifications.port;

var connect = function() {
  attempt += 1;
  if (attempt > 5) {
    logger.error("Failed to connect to RabbitMQ!");
    throw "RabbitMQ not available"
  }
  logger.info("Attempt " + attempt + " to connect to: " + url);

  ampq.connect(url, onConnect);
};

exports.connect = connect;
