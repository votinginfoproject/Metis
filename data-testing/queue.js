var logger = (require('../logging/vip-winston')).Logger;
var edn = require("jsedn");
var sender = require ("./sender");

var sendAddressFileMessage = null;

var logAndThrowPossibleError = function(err) {
  if (err !== null) {
    logger.error(err);
    throw err;
  }
}

// TODO: replace contents with actual parameters, convert to JSON string
var submitAddressFile = function(bucketName, fileName) {
  if (sendAddressFileMessage != null) {
    sendAddressFileMessage(new Buffer(edn.encode({"bucketName": bucketName, "fileName": fileName})));
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
  sender.sendNotifications(msg);
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

exports.submitAddressFile = submitAddressFile;
exports.setupAddressFileRequest = setupAddressFileRequest;
exports.setupAddressFileResponse = setupAddressFileResponse;
