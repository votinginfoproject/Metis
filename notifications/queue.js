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

var setupFeedProcessing = function(ch, exchange) {
  var processingComplete = config.notifications.topics.processingComplete;

  ch.assertQueue('dashboard.notifications.feed_processed', {}, function(err, ok) {
    logAndThrowPossibleError(err);

    var queue = ok.queue;
    ch.bindQueue(queue, exchange, processingComplete, {}, logAndThrowPossibleError);

    // TODO: Remove `noAck: true` option and only ack messages successfully handled
    ch.consume(queue, processMessage, {noAck: true}, logAndThrowPossibleError);
  });
};

var sendAddressFileMessage = null;

// TODO: replace contents with actual parameters, convert to JSON string
var submitAddressFile = function(contents) {
  if (sendAddressFileMessage != null) {
    sendAddressFileMessage(new Buffer(contents));
  } else {
    throw "Not connected to message queue for address file processing."
  }
};

var setupAddressFileRequest = function(ch) {
  ch.assertQueue('batch-address.file.submit', {}, function(err, ok) {
    logAndThrowPossibleError(err);

    var queue = ok.queue;
    sendAddressFileMessage = function(contents) {
      ch.sendToQueue(queue, contents);
    };
    logger.info("Connected to batch-address.file.submit queue");
  });
};

var processAddressFileResponse = function(msg) {
  // TODO: replace with actual processing later
  logger.info(msg.content.toString());
};

var setupAddressFileResponse = function(ch) {
  ch.assertQueue('batch-address.file.complete', {}, function(err, ok) {
    logAndThrowPossibleError(err);

    var queue = ok.queue;

    // TODO: remove noAck and do actual acknowledgement
    ch.consume(queue, processAddressFileResponse, {noAck: true}, logAndThrowPossibleError);
    logger.info("Connected to batch-address.file.complete queue");
  });
};


var onChannelOpen = function(err, ch) {
  logAndThrowPossibleError(err);

  var exchange = config.notifications.exchange;
  var exchangeOptions = config.notifications.exchangeOptions;

  ch.assertExchange(exchange, "topic", exchangeOptions);
  setupFeedProcessing(ch, exchange);
  setupAddressFileRequest(ch);
  setupAddressFileResponse(ch);
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
exports.submitAddressFile = submitAddressFile;
