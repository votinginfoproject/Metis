/**
 * Created by bantonides on 3/5/14.
 */
const
  path = require('path'),
  unfold = require('when/unfold'),
  csv = require('fast-csv'),
  config = require('./vaveConfig');

module.exports = function () {
  var initialized = false;
  var models;
  var feedId;

  var readComplete = false;
  var writeQue = [];

  var unfolding = false;

  function createFeedEntry(filePath) {
    models.Feed.create({
      _id: feedId,
      loadedOn: new Date(),
      feedPath: filePath,
      feedStatus: 'Parsing',
      name: path.basename(filePath)
    }, function (err, feed) {
      console.log('Wrote feed with id = ' + feed._id.toString());
    });
  }

  function parseCSV(fileStream) {
    var fileName = path.basename(fileStream.path, path.extname(fileStream.path));

    var mapperCtr = config.mapperLookup[fileName];
    if (mapperCtr === undefined) {
      fileStream.autodrain();
      return;
    }

    var mapper = new mapperCtr(models, feedId);

    console.log(fileName);
    var recordCount = 0;

    csv
      .fromStream(fileStream, { headers: true })
      .on('record', function (data) {
        mapper.mapCsv(data);
        writeQue.push(mapper.save());
        recordCount++;

        if (recordCount % 10000 == 0) {
          console.log('record count = %d and queue length = %d', recordCount, writeQue.length);
        }

        if (!unfolding && writeQue.length > 20000) {
          startUnfold();
        }
    }).on('end', function () {
        console.log('end');
        startUnfold();
      });
  }

  function startUnfold() {
    if (unfolding) {
      return;
    }

    console.log('Starting unfold');

    unfolding = true;
    unfold(unspool, condition, log, 0)
      .catch(function(err) {
        console.error (err);
      })
      .then(function() {
        console.log('read %d records', recordCount);
        console.log('unfold completed!!!!');
      });
  }

  function unspool(count) {
    var currentWrite = writeQue.shift();
    return [currentWrite, count++];
  }

  function condition(writes) {
    if (writeQue.length == 0) {
      console.log('condition = true');
      unfolding = false;
    }

    return writeQue.length == 0;
  }

  function log(data) {
    if (data) {
    } else { console.log('data null'); }
  }

  function consolidate() {
    var consolidator = require('./vaveConsolidator')();
    consolidator.consolidate(models, feedId);
  }

  return {
    processCSV: function (schemas, filePath, fileStream) {
      if (!initialized) {
        models = require('./vaveTempSchemas')(schemas.models);
        initialized = true;
      }

      if (feedId === undefined) {
        feedId = schemas.types.ObjectId();
        createFeedEntry(filePath);
      }

      parseCSV(fileStream);
    },
    consolidateFeedData: function () {
      console.log('consolidating feed data...')
      readComplete = true;
      consolidate();
    }
  };
};