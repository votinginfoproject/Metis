const config = require('../config');
const request = require('request');
const rp = require('request-promise');
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
  // upload file through dasher
  // we use multiparty to parse the incoming form from the Angular front-end
  // and then use FormData plugin to the request library to create a multi-part
  // form to send to dasher
  app.post('/dasher/upload', auth.checkJwt, function(req, res) {
    logger.info("uploading to dasher");
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
      console.log("*************");
      console.log(fields);
      console.log("*************");
      console.log(files);
      var user = auth.getUserFromRequest(req);
      var apiKeyHeader = "Api-key " + user["id"] + ":" + user["user_metadata"]["api-key"];

      var formData = {
        'type': fields.type,
        'election-date': fields.date,
        'file': {
          value: fs.createReadStream(files.file[0].path),
          options: {
            filename: files.file[0].originalFilename,
            size: files.file[0].size
          }
        }
      }
      var options = {
        url: req.protocol + '://' + config.dasher.domain + '/upload',
        // use the same authorization header to use same user account
        headers: {
          'Authorization': apiKeyHeader
        },
        formData: formData
      }
      console.log("making request to dasher");
      rp.post(options).then(body => {
        console.log("in then");
        res.status(200).send();
      }).catch(err => {
        console.log("in catch");
        res.status(500).send(err);
      });
    });
    return;
  });
}

exports.registerDasherServices = registerDasherServices;
