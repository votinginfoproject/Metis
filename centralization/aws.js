var AWS = require('aws-sdk');
var fs = require('fs');
var multiparty = require('multiparty');
var config = require('../config');
var logger = (require('../logging/vip-winston')).Logger;

AWS.config.update({ accessKeyId: config.aws.accessKey, secretAccessKey: config.aws.secretKey });
var batchAddressBucket = config.batt.batchAddressBucket;

module.exports = {
  uploadFile: function(req, res){
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
      console.log(fields.date);
      console.log(files.file.path);

    //   var fipsCode = fields["fipsCode"];
    //   res.writeHead(200, {'content-type': 'text/plain'});
    //   res.write('received upload:\n\n');
    //   res.end(JSON.stringify(files));
    //   var fileStream = fs.createReadStream(files.file.path);
    //   fileStream.on('error', function (err) {
    //     if (err) { throw err; }
    //   });
    //   fileStream.on('open', function () {
    //     var s3 = new AWS.S3();
    //     if (fipsCode === undefined) {
    //       fipsCode = "undefined"
    //     };
    //     var bucketName = batchAddressBucket;
    //     var fileName = fipsCode + '/input/' + files.file.originalFilename;
    //     logger.info("putting file with name '" + fileName + "' into bucket '" + bucketName + "'");
    //     s3.putObject({
    //       Bucket: bucketName,
    //       Key: fileName,
    //       Body: fileStream
    //     }, function (err) {
    //       if (err) {
    //         throw err;
    //       } else {
    //         queue.submitAddressFile(bucketName, fileName, fipsCode);
    //       }
    //     });
    //   });
    });
    return;
  }
};
