var aws = require("../aws/s3.js");
var auth = require('../authentication/services.js');

function registerDataUploadServices (app) {
  app.get('/data-upload/submitted-files', auth.checkJwt, aws.getDataUploadFiles);
}

exports.registerDataUploadServices = registerDataUploadServices;
