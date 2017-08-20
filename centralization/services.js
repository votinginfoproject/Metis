var aws = require("./aws.js");
var auth = require('../authentication/services.js');

function registerCentralizationServices (app) {
  app.all('/centralization/*', auth.checkJwt);
  app.post('/centralization/upload', aws.uploadFile);
}

exports.registerCentralizationServices = registerCentralizationServices;
