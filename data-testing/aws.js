var AWS = require('aws-sdk');
var fs = require('fs');
var multiparty = require('multiparty');
var authorization = require('../authentication/utils.js');
var config = require('../config');
var queue = require('./queue')
var logger = (require('../logging/vip-winston')).Logger;

AWS.config.update({ accessKeyId: config.aws.accessKey, secretAccessKey: config.aws.secretKey });

module.exports = {
  uploadAddressFile: function(req, res){
    if (req.isAuthenticated() == false) {
      res.writeHead(403);
      res.write('must be authenticated to submit a file for testing')
      res.end();
      return;
    };
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');
      res.end(JSON.stringify(files));
      var fileStream = fs.createReadStream(files.file.path);
      fileStream.on('error', function (err) {
        if (err) { throw err; }
      });
      fileStream.on('open', function () {
        var s3 = new AWS.S3();
        var groupName = authorization.stateGroupNames(req.user)[0];
        if (groupName === undefined) {
          groupName = "undefined"
        };
        var bucketName = 'address-testing';
        var fileName = groupName + '/input/' + files.file.originalFilename;
        logger.info("putting file with name '" + fileName + "' into bucket '" + bucketName + "'");
        s3.putObject({
          Bucket: bucketName,
          Key: fileName,
          Body: fileStream
        }, function (err) {
          if (err) {
            throw err;
          } else {
            queue.submitAddressFile(bucketName, fileName, groupName);
          }
        });
      });
    });


    return;

  },
  getLatestResultsFile: function(req, res){
    var s3 = new AWS.S3();
    var groupName = authorization.stateGroupNames(req.user)[0];
    if (groupName === undefined) {
      groupName = "undefined";
    }
    var bucketName = 'address-testing';
    var fileName  = groupName + "/output/results.csv"

    var params = {
      Bucket: bucketName,
      MaxKeys: 1,
      Prefix: fileName
    };
    s3.listObjects(params, function(err, data) {
      if (err) {
        logger.error(err, err.stack);
        res.writeHead(500, {'content-type': 'text/plain'});
        res.end();
      } else {
        logger.info(JSON.stringify(data));
        if (data["Contents"].length > 0) {
          var params = {Bucket: bucketName, Key: fileName, Expires: 3600};
          logger.info("requesting from Amazon with params: " + JSON.stringify(params));
          var url = s3.getSignedUrl('getObject', params);
          logger.info("generated pre-signed URL " + url);
          res.writeHead(200, {'content-type': 'text/plain'});
          res.write(url);
          res.end();
        } else {
          res.writeHead(404, {'content-type': 'text/plain'});
          res.end();
        }
      }
    });
  }
};
