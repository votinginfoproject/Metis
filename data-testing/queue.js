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

var generateUUID = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
};

var submitAddressFile = function(bucketName, fileName, groupName) {
  var transactionId = generateUUID();
  console.log(transactionId);
  if (sendAddressFileMessage != null) {
    sendAddressFileMessage(new Buffer(edn.encode({"bucketName": bucketName,
                                                  "fileName": fileName,
                                                  "groupName": groupName,
                                                  "transactionId": transactionId})));
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
  var message = edn.toJS(edn.parse(msg.content.toString()));
  logger.info(message);
  sender.sendNotifications(message);
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
