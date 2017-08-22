var AWS = require('aws-sdk');
var fs = require('fs');
var multiparty = require('multiparty');
var config = require('../config');
var logger = (require('../logging/vip-winston')).Logger;

AWS.config.update({ accessKeyId: config.aws.accessKey, secretAccessKey: config.aws.secretKey });
var centralizationBucket = config.dataCentralization.centralizationBucket;

module.exports = {
  uploadFile: function(req, res){
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
      console.log(fields.date);
      console.log(files.file.path);
      console.log(fields.fipsCode);
      var date = fields["date"];
      var fipsCode = fields["fipsCode"];
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
    });
    return;
  },

  getSubmittedFiles: function(req, res){
    var s3 = new AWS.S3();
    var fipsCode = req.query.fipsCode;
    if (fipsCode === undefined) {
      fipsCode = "undefined";
    }
    var bucketName = centralizationBucket;
    fips2 = fipsCode.slice(0, 2);
    var prefix = fips2 + '/' + fipsCode;

    var params = {
      Bucket: bucketName,
      Prefix: prefix
    };
    s3.listObjects(params, function(err, data) {
      var files = data["Contents"];
      var returnData = []
      for (var i = 0; i < files.length; i++) {
        var key = files[i]["Key"];
        var lastModified = files[i]["LastModified"];
        var keyParts = key.split('/');
        var fileName = keyParts[keyParts.length - 1]
        var electionDate = keyParts[keyParts.length - 2]
        if (fileName && electionDate) {
          var file = {"electionDate": electionDate,
                      "fileName": fileName,
                      "lastModified": lastModified}
          returnData.push(file);
        }
      };
      console.log(returnData);
      if (err) {
        logger.error(err, err.stack);
        res.writeHead(500, {'content-type': 'text/plain'});
        res.end();
      } else {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write(JSON.stringify(returnData));
        res.end();
      }
    });
  }
};