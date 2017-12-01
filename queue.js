var logger = (require('./logging/vip-winston')).Logger;
var ampq = require('amqplib/callback_api');
var config = require('./config');
var notificationsQueue = require('./notifications/feed-processing/queue');
var dataTestingQueue = require('./notifications/data-testing/queue');

var connection = null;
var attempt = 0;

var logAndThrowPossibleError = function(err) {
  if (err !== null) {
    logger.error(err);
    throw err;
  }
}

var onChannelOpen = function(err, ch) {
  logAndThrowPossibleError(err);

  var exchange = config.notifications.exchange;
  var exchangeOptions = config.notifications.exchangeOptions;

  ch.assertExchange(exchange, "topic", exchangeOptions);
  notificationsQueue.setupFeedProcessing(ch, exchange);
  dataTestingQueue.setupAddressFileRequest(ch);
  dataTestingQueue.setupAddressFileResponse(ch);
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
exports.logAndThrowPossibleError = logAndThrowPossibleError;
