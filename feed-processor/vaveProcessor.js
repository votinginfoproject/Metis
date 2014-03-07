/**
 * Created by bantonides on 3/5/14.
 */
const
  path = require('path'),
  csv = require('fast-csv'),
  config = require('./vaveConfig');

module.exports = function () {
  var initialized = false;
  var models;
  var feedId;

  var writeQue = [];

  function onError(err) {
    console.error(err);
  }

  function onSave(docType) {
    console.log('Stored %s to database.', docType);

  }

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

    csv
      .fromStream(fileStream, { headers: true })
      .on('record', function (data) {
        mapper.mapCsv(data);
        mapper.save(onError, onSave.bind(undefined, fileName))
    }).on('end', function () {
        console.log('end');
      });
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
    }
  };
};