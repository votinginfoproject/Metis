var aws = require("./s3.js");
var auth = require('../authentication/services.js');

function registerCentralizationServices (app) {
  app.all('/centralization/*', auth.checkJwt);
  app.post('/centralization/upload', aws.uploadCentralizationFile);
  app.get('/centralization/submitted-files', aws.getSubmittedCentralizationFiles);
}

function registerDataVerificationServices (app) {
  app.all('/testing/*', auth.checkJwt);
  app.post('/testing/upload', aws.uploadBatchAddressTestFile);
  app.get('/testing/latest-results-file', aws.getLatestBatchAddressTestResultsFile);
}

exports.registerCentralizationServices = registerCentralizationServices;
exports.registerDataVerificationServices = registerDataVerificationServices;
