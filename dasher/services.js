const config = require('../config');
const request = require('request');
const fs = require('fs');
const multiparty = require('multiparty');
const FormData = require('form-data');
const auth = require('../authentication/services.js');
const logger = (require('../logging/vip-winston')).Logger;

function registerDasherServices(app) {
  // pass requests to generate-api-key on to dasher
  app.post('/dasher/generate-api-key', auth.checkJwt, function(req, res) {
    logger.info("forwarding api-key generation request");
    var options = {
      url: config.dasher.protocol + '://' + config.dasher.domain + '/generate-api-key',
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
  // upload file through dasher
  // we use multiparty to parse the incoming form from the Angular front-end
  // and then use FormData plugin to the request library to create a multi-part
  // form to send to dasher
  app.post('/dasher/upload', auth.checkJwt, function(req, res) {
    logger.info("uploading to dasher");
    var form = new multiparty.Form();
    form.parse(req, function(err, fieldsObject, filesObject, fieldsList, filesList) {
      var user = auth.getUserFromRequest(req);
      var apiKeyHeader = "Api-key " + user["id"] + ":" + user["user_metadata"]["api-key"];

      var formData = {
        'type': fieldsObject.type,
        'election-date': fieldsObject.date,
        'file': {
          value: fs.createReadStream(filesList[0].path),
          options: {
            filename: filesList[0].originalFilename,
            size: filesList[0].size
          }
        }
      }
      var options = {
        url: config.dasher.protocol + '://' + config.dasher.domain + '/upload',
        // use the same authorization header to use same user account
        headers: {
          'Authorization': apiKeyHeader
        },
        formData: formData
      }
      logger.info("posting file to dasher");
      request.post(options, function(error, response, body){
        if(error){
          logger.error("got error from dasher: ", error);
          res.status(500).send(error);
        } else if(response && response.statusCode){
          logger.info("response: ", response.statusCode);
          res.status(response.statusCode).send();
        }
      });
    });
    return;
  });
}

exports.registerDasherServices = registerDasherServices;
