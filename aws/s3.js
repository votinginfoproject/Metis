var AWS = require('aws-sdk');
var fs = require('fs');
var multiparty = require('multiparty');
var config = require('../config');
var queue = require('../notifications/data-testing/queue')
var logger = (require('../logging/vip-winston')).Logger;
var auth = require('../authentication/services.js')

AWS.config.update({ accessKeyId: config.aws.accessKey, secretAccessKey: config.aws.secretKey });
var batchAddressBucket = config.batt.batchAddressBucket;
var centralizationBucket = config.dataCentralization.centralizationBucket;

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
      var fileStream = fs.createReadStream(files.file.path);
      fileStream.on('error', function (err) {
        if (err) { throw err; }
      });
      fileStream.on('open', function () {
        var s3 = new AWS.S3();
        var bucketName = batchAddressBucket;
        var fileName = fipsCode + '/input/' + files.file.originalFilename;
        logger.info("putting file with name '" + fileName + "' into bucket '" + bucketName + "'");
        s3.putObject({
          Bucket: bucketName,
          Key: fileName,
          Body: fileStream
        }, function (err) {
          if (err) {
            throw err;
          } else {
            queue.submitAddressFile(bucketName, fileName, fipsCode);
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

  uploadCentralizationFile: function(req, res){
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
      if (err) {
        logger.error("Error uploading centralization file: ", err);
        //change this status code when we know more about what we're dealing with
        res.writeHead(200, {'content-type': 'text/plain'});
        res.end();
      } else {
				var fipsCodes = auth.getUserFipsCodes(req);
				var fipsCode = fipsCodes[0];
				var date = fields["date"];
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
        res.end(JSON.stringify(files));
        var fileStream = fs.createReadStream(files.file.path);
        fileStream.on('error', function (err) {
          if (err) { throw err; }
        });
        fileStream.on('open', function () {
          var s3 = new AWS.S3();
          if (fipsCode === undefined) {
            fipsCode = "undefined"
          };
          fips2 = fipsCode.slice(0, 2);
          var fileName = fips2+ '/' + fipsCode + '/' + date + '/' + files.file.originalFilename;
          logger.info("putting file with name '" + fileName + "' into bucket '" + centralizationBucket + "'");
          s3.putObject({
            Bucket: centralizationBucket,
            Key: fileName,
            Body: fileStream
          }, function (err) {
            if (err) {
              console.log("Error uploading centralization data file:");
              console.log(err);
              throw err;
            }
          });
        });
      }
    });
    return;
  },

  getSubmittedCentralizationFiles: function(req, res){
    var s3 = new AWS.S3();
		var fipsCodes = auth.getUserFipsCodes(req);
		var fipsCode = fipsCodes[0];
    if (fipsCodes === undefined || fipsCode === undefined) {
      fipsCode = "undefined";
    }
    var bucketName = centralizationBucket;

    if (auth.isSuperAdmin(req)){
      prefix = "";
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
        var keyParts = key.split('/');
        var stateFips = keyParts[0];
        var countyFips = keyParts[1];
        var electionDate = keyParts[2];
        var fileName = keyParts[3];
        if (fileName && electionDate) {
          var file = {"electionDate": electionDate,
                      "fileName": fileName,
                      "lastModified": lastModified,
                      "stateFips": stateFips,
                      "countyFips": countyFips}
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
