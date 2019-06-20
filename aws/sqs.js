var logger = (require('../logging/vip-winston')).Logger;
var config = require('../config');
var feedProcessing = require('../notifications/feed-processing/queue');
var addressTest = require('../notifications/data-testing/queue');
const { Consumer } = require('sqs-consumer');
var edn = require("jsedn");
const AWS = require('aws-sdk');

var convertRegion = function(region) {
  region.toLowerCase().replace("_", "-");
}

// Create an SQS service object
var sqs = new AWS.SQS({accessKeyId: config.aws.accessKey,
                       secretAccessKey: config.aws.secretKey,
                       region: convertRegion(config.aws.sqs.region),
                       apiVersion: '2012-11-05'});

var createConsumer = function(queueUrl, handler) {
  var consumer = Consumer.create({
    queueUrl: queueUrl,
    handleMessage: handler,
    sqs: sqs
  });

  consumer.on('error', (err) => {
    logger.error("Error consuming SQS message from queue:", queueUrl);
    logger.error(err);
  });

  consumer.on('processing_error', (err) => {
    logger.error("Error processing SQS message from queue:", queueUrl);
    logger.error(err);
  });

  consumer.on('timeout_error', (err) => {
    logger.error("SQS Timeout from queue:", queueUrl);
    logger.error(err);
  });

  consumer.start();
  return consumer;
}

var feedSuccessConsumer = createConsumer(config.aws.sqs.feedSuccessURL,
                                         feedProcessing.processSuccessMessage);

var feedFailureConsumer = createConsumer(config.aws.sqs.feedFailureURL,
                                        feedProcessing.processFailureMessage);

var addressTestSuccessConsumer = createConsumer(config.aws.sqs.addressTestSuccessURL,
                                                addressTest.processSuccessMessage);

var addressTestFailureConsumer = createConsumer(config.aws.sqs.addressTestFailureURL,
                                                addressTest.processFailureMessage);

var generatePseudoRandomRequestID = function() {
  // function used to generate pseudo-random numbers to be used as transactionIds
  // adapted from here: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript#2117523
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
};

module.exports = {
  sendBatchProcessMessage: function(bucketName, fileName, fipsCode) {
    var transactionId = generatePseudoRandomRequestID();
    var message = edn.encode({"bucketName": bucketName,
                              "fileName": fileName,
                              "fipsCode": fipsCode,
                              "transactionId": transactionId});
    var params = {
      DelaySeconds: 10,
      MessageBody: message,
      QueueUrl: config.aws.sqs.addressTestRequestURL
    };
    sqs.sendMessage(params, function(err, data) {
      if (err) {
        logger.error("Error sending address test request message", err);
      } else {
        logger.info("Sent address test request message", data.MessageId);
      }
    });
  }
}
