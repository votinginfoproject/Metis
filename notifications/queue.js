var logger = (require('../logging/vip-winston')).Logger;
var ampq = require('amqplib/callback_api');
var config = require('../config');
var edn = require("jsedn");
var sender = require('./sender.js');

var connection = null;
var attempt = 0;

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

var onChannelOpen = function(err, ch) {
  logAndThrowPossibleError(err);

  var ex = config.notifications.exchange;
  var exOptions = config.notifications.exchangeOptions;
  var processingComplete = config.notifications.topics.processingComplete;

  ch.assertExchange(ex, "topic", exOptions);
  ch.assertQueue('dashboard.notifications.feed_processed', {}, function(err, ok) {
    logAndThrowPossibleError(err);

    var queue = ok.queue;
    ch.bindQueue(queue, ex, processingComplete, {}, logAndThrowPossibleError);

    // TODO: Remove `noAck: true` option and only ack messages successfully handled
    ch.consume(queue, processMessage, {noAck: true}, logAndThrowPossibleError);
  });
};

var onConnect = function(err, conn) {
  if (err !== null) {
    logger.warning("Connection to RabbitMQ failed.");
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
    logger.log("alert", "Failed to connect to RabbitMQ!");
    return;
  }
  logger.info("Attempt " + attempt + " to connect to: " + url);

  ampq.connect(url, onConnect);
};

exports.connect = connect;
