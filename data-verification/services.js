var aws = require("../aws/s3.js");
var auth = require('../authentication/services.js');

function registerDataVerificationServices (app) {
  app.all('/testing/*', auth.checkJwt);
  app.post('/testing/upload', aws.uploadBatchAddressTestFile);
  app.get('/testing/latest-results-file', aws.getLatestBatchAddressTestResultsFile);
}

exports.registerDataVerificationServices = registerDataVerificationServices;
