var AWS = require('aws-sdk');
var fs = require('fs');
var config = require('../config');
var logger = (require('../logging/vip-winston')).Logger;
var moment = require('moment');

AWS.config.update({ accessKeyId: config.aws.accessKey, secretAccessKey: config.aws.secretKey });
var earlyVoteSiteBucket = config.earlyVoteSites.bucket;

var formatDate = function(date) {
  var asMoment = moment(date);
  return asMoment.format('YYYY-MM-DD');
}

var uploadFile = function(file, filename, election, closeCallback) {
  var fileStream = fs.createReadStream(file.name);
  fileStream.on('error', function (err) {
    if (err) { throw err; }
  });
  fileStream.on('open', function () {
    var s3 = new AWS.S3();
    var bucketName = earlyVoteSiteBucket;
    var date_string = formatDate(election["election_date"]);
    var fileName = election.state_fips + "/" + date_string + "/" + filename;
    logger.info("putting file with name '" + fileName + "' into bucket '" + bucketName + "'");
    s3.putObject({
      Bucket: bucketName,
      Key: fileName,
      Body: fileStream
    }, function (err) {
      if (err) {
        throw err;
      }
    });
  });
  fileStream.on('close', function() {
    closeCallback();
  })
}

exports.uploadFile = uploadFile;
