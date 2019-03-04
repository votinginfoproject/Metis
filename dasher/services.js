const config = require('../config');
const request = require('request');
const auth = require('../authentication/services.js');
var logger = (require('../logging/vip-winston')).Logger;

function registerDasherServices(app) {
  // pass requests to generate-api-key on to dasher
  app.post('/dasher/generate-api-key', auth.checkJwt, function(req, res) {
    logger.info("forwarding api-key generation request");
    var options = {
      url: req.protocol + '://' + config.dasher.domain + '/generate-api-key',
      // use the same authorization header to use same user account
      headers: {
        'Authorization': req.headers['authorization']
      },
      form: req.body
    }
    request.post(options, function(error, response, body){
      if(error){
        res.status(500).send(error);
      } else if(response && response.statusCode){
        // force the Angular client to logout so they can get
        // the refreshed api key on login
        res.status(401).send();
      }
    })
  });
}

exports.registerDasherServices = registerDasherServices;
