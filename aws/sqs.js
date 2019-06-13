var logger = (require('../logging/vip-winston')).Logger;
var config = require('../config');
var feedProcessing = require('../notifications/feed-processing/queue');
const { Consumer } = require('sqs-consumer');
const AWS = require('aws-sdk');

AWS.config.update({accessKeyId: config.aws.accessKey,
                   secretAccessKey: config.aws.secretKey,
                   region: config.aws.sqs.region});

var createConsumer = function(queueUrl, handler) {
  var consumer = Consumer.create({
    queueUrl: queueUrl,
    handleMessage: handler,
    sqs: new AWS.SQS()
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
