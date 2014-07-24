/**
 * Created by bantonides on 3/5/14.
 */
const
  path = require('path'),
  unfold = require('when/unfold'),
  csv = require('fast-csv'),
  config = require('./vaveConfig'),
  moment = require('moment');


module.exports = function () {
  var initialized = false;
  var models;
  var feedId;

  var readComplete = false;
  var writeQue = [];

  var unfolding = false;
  var logger = (require('../logging/vip-winston')).Logger;

  function parseCSV(fileStream, errorFn) {
    var fileName = path.basename(fileStream.path, path.extname(fileStream.path));

    var mapperCtr = config.mapperLookup[fileName];
    if (mapperCtr === undefined) {
      fileStream.autodrain();
      return;
    }

    var mapper = new mapperCtr(models, feedId);

    logger.info(fileName);
    var recordCount = 0;

    csv
      .fromStream(fileStream, { headers: true, ignoreEmpty: true })
      .on('record', function (data) {
        mapper.mapCsv(data);

        var savePromise = mapper.save();

        if (savePromise) {
          writeQue.push(savePromise);
        }
        recordCount++;

        if (recordCount % 10000 == 0) {
          logger.info('record count = %d and queue length = %d', recordCount, writeQue.length);
        }

        if (!unfolding && writeQue.length > config.mongoose.maxWriteQueueLength) {
          startUnfold();
        }
      })
      .on('error', function(err) {
        logger.error("error in csv parsing : " + err.message);
        errorFn({"errorMessage": err.message,
                 "stack": err.stack,
                 "fileName": fileName});
      })
      .on('end', function () {
        logger.info('end');
        startUnfold();
      });
  }

  function startUnfold() {
    if (unfolding) {
      return;
    }

    logger.info('Starting unfold');

    unfolding = true;
    unfold(unspool, condition, log, 0)
      .catch(function(err) {
        logger.error (err);
      })
      .then(function() {
        logger.info('unfold completed!!!!');
      });
  }

  function unspool(count) {
    var currentWrite = writeQue.shift();
    return [currentWrite, count++];
  }

  function condition(writes) {
    if (writeQue.length == 0) {
      logger.info('condition = true');
      unfolding = false;
    }

    return writeQue.length == 0;
  }

  function log(data) {
    if (data) {
    } else { logger.info('data null'); }
  }

  function consolidate() {
    var consolidator = require('./vaveConsolidator')();
    consolidator.consolidate(models, feedId);
  }

  return {
    processCSV: function (schemas, filePath, fileStream, errorFn) {
      if (!initialized) {
        models = require('./vaveTempSchemas')(schemas.models);
        initialized = true;
      }


      if (feedId === undefined) {
        feedId = schemas.types.ObjectId();

        models.feeds.create({
          _id: feedId,
          complete: false,
          failed: false,
          completedOn: null,
          loadedOn: moment().utc(),
          feedPath: filePath,
          feedStatus: 'Parsing',
          name: path.basename(filePath),
          friendlyId: null
        }, function (err, feed) {
          logger.error('Error in feed with id = ' + feed._id.toString());
        });

        // if we are a child process
        if (process.send) {
          // tell the parent about the feedid of the current feed being processed
          process.send({"messageId": 1, "feedId": feedId.toString()});
        }
      }
        // (NOTE if child process) *** *** ***
        // If the processing fails it will get caught by the parent, but only
        // after the message in the send() statement above finishes as node is single threaded
        // Make sure the end target of the send() call above only does in memory operations and
        // no blocking I/O or asynchronous operations, which would break this pattern and require us
        // to wait for the send() calls execution to finish before starting the processing below.

      // start the processing
      parseCSV(fileStream, errorFn);
    },
    consolidateFeedData: function () {
      logger.info('consolidating feed data...');
      readComplete = true;
      consolidate();
    }
  };
};
