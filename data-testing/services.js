var aws = require("./aws.js");

function registerDataVerificationServices (app) {
  app.post('/testing/upload', aws.uploadAddressFile);
}

exports.registerDataVerificationServices = registerDataVerificationServices;
