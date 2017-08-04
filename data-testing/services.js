var aws = require("./aws.js");
var auth = require('../authentication/services.js');

function registerDataVerificationServices (app) {
  app.all('/testing/*', auth.checkJwt);
  app.post('/testing/upload', aws.uploadAddressFile);
  app.get('/testing/latest-results-file', aws.getLatestResultsFile);
}

exports.registerDataVerificationServices = registerDataVerificationServices;
