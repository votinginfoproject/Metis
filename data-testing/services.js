var aws = require("./aws.js");

function registerDataVerificationServices (app) {
  app.post('/testing/upload', aws.uploadAddressFile);
  app.get('/testing/latest-results-file', aws.getLatestResultsFile);
}

exports.registerDataVerificationServices = registerDataVerificationServices;
