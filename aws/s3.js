var AWS = require('aws-sdk');
var fs = require('fs');
var multiparty = require('multiparty');
var config = require('../config');
var queue = require('../notifications/data-testing/queue')
var logger = (require('../logging/vip-winston')).Logger;
var auth = require('../authentication/services.js');
var states = require('../utils/states.js');
var sqs = require('./sqs.js');

AWS.config.update({ accessKeyId: config.aws.accessKey, secretAccessKey: config.aws.secretKey });
var batchAddressBucket = config.batt.batchAddressBucket;
var dataUploadBucket = config.dataUpload.bucket;

module.exports = {
  uploadBatchAddressTestFile: function(req, res){
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
			var fipsCodes = auth.getUserFipsCodes(req);
      var fipsCode = null;
			if (fipsCodes === undefined || fipsCodes[0] === undefined) {
	      fipsCode = "undefined";
	    } else {
				fipsCode = fipsCodes[0];
			}
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');
      res.end(JSON.stringify(files));
      var fileStream = fs.createReadStream(files.file[0].path);
      fileStream.on('error', function (err) {
        if (err) { throw err; }
      });
      fileStream.on('open', function () {
        var s3 = new AWS.S3();
        var bucketName = batchAddressBucket;
        var fileName = fipsCode + '/input/' + files.file[0].originalFilename;
        logger.info("putting file with name '" + fileName + "' into bucket '" + bucketName + "'");
        s3.putObject({
          Bucket: bucketName,
          Key: fileName,
          Body: fileStream
        }, function (err) {
          if (err) {
            throw err;
          } else {
            sqs.sendBatchProcessMessage(bucketName, fileName, fipsCode);
          }
        });
      });
    });
    return;
  },
  getLatestBatchAddressTestResultsFile: function(req, res){
    var s3 = new AWS.S3();
		var fipsCodes = auth.getUserFipsCodes(req);
		var fipsCode = null;
    if (fipsCodes === undefined || fipsCodes[0] === undefined) {
      fipsCode = "undefined";
    } else {
			fipsCode = fipsCodes[0];
		}
    var bucketName = batchAddressBucket;
    var fileName  = fipsCode + "/output/results.csv"

    var params = {
      Bucket: bucketName,
      MaxKeys: 1,
      Prefix: fileName
    };
    s3.listObjectsV2(params, function(err, data) {
      if (err) {
        logger.error(err, err.stack);
        res.writeHead(500, {'content-type': 'text/plain'});
        res.end();
      } else {
        logger.info(JSON.stringify(data));
        if (data["Contents"].length > 0) {
          var params = {Bucket: bucketName, Key: fileName, Expires: 3600};
          var url = s3.getSignedUrl('getObject', params);
          res.writeHead(200, {'content-type': 'text/plain'});
          res.write(url);
          res.end();
        } else {
          res.writeHead(404, {'content-type': 'text/plain'});
          res.end();
        }
      }
    });
  },

  getDataUploadFiles: function(req, res){
    var s3 = new AWS.S3();
		var fipsCodes = auth.getUserFipsCodes(req);
		var fipsCode = fipsCodes[0];
    if (fipsCodes === undefined || fipsCode === undefined) {
      fipsCode = "undefined";
    }
    var bucketName = dataUploadBucket;

    if (auth.isSuperAdmin(req)){
      if (req.query['prefix']) {
        prefix = req.query['prefix'];
      } else {
        prefix = "";
      }
    } else {
      fips2 = fipsCode.slice(0, 2);
      var prefix = fips2 + '/' + fipsCode;
    };

    var params = {
      Bucket: bucketName,
      Prefix: prefix
    };
    s3.listObjectsV2(params, function(err, data) {
      var files = data["Contents"];
      var returnData = []
      for (var i = 0; i < files.length; i++) {
        var key = files[i]["Key"];
        var lastModified = files[i]["LastModified"];
        var stateFips = key.match(/(\d{2})\//);
        var countyFips = key.match(/\/(\d{3})\//);
        var electionDate = key.match(/\/(\d{4}-\d{1,2}-\d{1,2})\//);
        var feed = key.match(/\/feeds\//);
        var fileName = key.split("/").slice(-1)[0];
        if (fileName) {
          var file = {"electionDate": electionDate ? electionDate[1] : "",
                      "fileName": fileName,
                      "lastModified": lastModified,
                      "stateFips": stateFips ? stateFips[1] : "",
                      "stateName": stateFips ? states.stateName(stateFips[1]) : "",
                      "countyFips": countyFips ? countyFips[1] : "",
                      "isFeed": feed ? true : false}
          returnData.push(file);
        }
      };
      if (err) {
        logger.error(err, err.stack);
        res.writeHead(500, {'content-type': 'text/plain'});
        res.end();
      } else {
        // sort returned data
        returnData.sort(function (a, b) {
          return b.lastModified - a.lastModified
        });
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write(JSON.stringify(returnData));
        res.end();
      }
    });
  }
};
