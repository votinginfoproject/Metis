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
    form.parse(req, function(err, fields, files) {
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


  // get elections through dasher
  app.get('/dasher/elections', auth.checkJwt, function(req, res) {
    logger.info("getting elections from dasher");
    var options = {
      url: config.dasher.protocol + '://' + config.dasher.domain + '/elections',
      // use the same authorization header to use same user account
      headers: {
        'Authorization': req.headers['authorization']
      },
      form: req.body
    }
    request.get(options, function(error, response, body){
      if(error){
        res.status(500).send(error);
      } else if(response && response.statusCode){
        res.status(response.statusCode).send(response.body);
      }
    })
  });

  // get single election through dasher
  app.get('/dasher/elections/:id', auth.checkJwt, function(req, res) {
    var options = {
      url: config.dasher.protocol + '://' + config.dasher.domain + '/elections/' + req.params['id'],
      // use the same authorization header to use same user account
      headers: {
        'Authorization': req.headers['authorization']
      },
      form: req.body
    }
    request.get(options, function(error, response, body){
      if(error){
        res.status(500).send(error);
      } else if(response && response.statusCode){
        res.status(response.statusCode).send(response.body);
      }
    })
  });

  // post election through dasher
  app.post('/dasher/elections', auth.checkJwt, function(req, res) {
    var options = {
      url: config.dasher.protocol + '://' + config.dasher.domain + '/elections/new',
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
        res.status(response.statusCode).send(response.body);
      }
    })
  });

  // update election through dasher
  app.put('/dasher/elections/:id', auth.checkJwt, function(req, res) {
    var options = {
      url: config.dasher.protocol + '://' + config.dasher.domain + '/elections/' + req.params['id'],
      // use the same authorization header to use same user account
      headers: {
        'Authorization': req.headers['authorization']
      },
      form: req.body
    }
    request.put(options, function(error, response, body){
      if(error){
        res.status(500).send(error);
      } else if(response && response.statusCode){
        res.status(response.statusCode).send(response.body);
      }
    })
  });

  // delete election through dasher
  app.delete('/dasher/elections/:id', auth.checkJwt, function(req, res) {
    var options = {
      url: config.dasher.protocol + '://' + config.dasher.domain + '/elections/' + req.params['id'],
      // use the same authorization header to use same user account
      headers: {
        'Authorization': req.headers['authorization']
      },
      form: req.body
    }
    request.delete(options, function(error, response, body){
      if(error){
        res.status(500).send(error);
      } else if(response && response.statusCode){
        res.status(response.statusCode).send(response.body);
      }
    })
  });

  // get early vote sites through dasher
  app.get('/dasher/elections/:electionId/early-vote-sites', auth.checkJwt, function(req, res) {
    logger.info("getting early vote sites from dasher");
    var options = {
      url: config.dasher.protocol + '://' + config.dasher.domain + '/elections/' + req.params['electionId'] + '/early-vote-sites',
      // use the same authorization header to use same user account
      headers: {
        'Authorization': req.headers['authorization']
      },
      form: req.body
    }
    request.get(options, function(error, response, body){
      if(error){
        res.status(500).send(error);
      } else if(response && response.statusCode){
        res.status(response.statusCode).send(response.body);
      }
    })
  });

  // get single early vote site through dasher
  app.get('/dasher/early-vote-sites/:id', auth.checkJwt, function(req, res) {
    logger.info("getting early vote site from dasher");
    var options = {
      url: config.dasher.protocol + '://' + config.dasher.domain + '/early-vote-sites/' + req.params['id'],
      // use the same authorization header to use same user account
      headers: {
        'Authorization': req.headers['authorization']
      },
      form: req.body
    }
    request.get(options, function(error, response, body){
      if(error){
        res.status(500).send(error);
      } else if(response && response.statusCode){
        res.status(response.statusCode).send(response.body);
      }
    })
  });

  // post early vote site through dasher
  app.post('/dasher/elections/:electionId/early-vote-sites/', auth.checkJwt, function(req, res) {
    var options = {
      url: config.dasher.protocol + '://' + config.dasher.domain + '/elections/' + req.params['electionId'] + '/early-vote-sites/new',
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
        res.status(response.statusCode).send(response.body);
      }
    })
  });

  // update early vote site through dasher
  app.put('/dasher/early-vote-sites/:id', auth.checkJwt, function(req, res) {
    var options = {
      url: config.dasher.protocol + '://' + config.dasher.domain + '/early-vote-sites/' + req.params['id'],
      // use the same authorization header to use same user account
      headers: {
        'Authorization': req.headers['authorization']
      },
      form: req.body
    }
    request.put(options, function(error, response, body){
      if(error){
        res.status(500).send(error);
      } else if(response && response.statusCode){
        res.status(response.statusCode).send(response.body);
      }
    })
  });

  // delete early vote site through dasher
  app.delete('/dasher/early-vote-sites/:id', auth.checkJwt, function(req, res) {
    var options = {
      url: config.dasher.protocol + '://' + config.dasher.domain + '/early-vote-sites/' + req.params['id'],
      // use the same authorization header to use same user account
      headers: {
        'Authorization': req.headers['authorization']
      },
      form: req.body
    }
    request.delete(options, function(error, response, body){
      if(error){
        res.status(500).send(error);
      } else if(response && response.statusCode){
        res.status(response.statusCode).send(response.body);
      }
    })
  });

  // get schedules through dasher
  app.get('/dasher/elections/:electionId/early-vote-sites/:earlyVoteSiteId/schedules', auth.checkJwt, function(req, res) {
    logger.info("getting schedules from dasher");
    var options = {
      url: config.dasher.protocol + '://' + config.dasher.domain + '/elections/' + req.params['electionId'] + '/early-vote-sites/' + req.params['earlyVoteSiteId'] + '/schedules',
      // use the same authorization header to use same user account
      headers: {
        'Authorization': req.headers['authorization']
      },
      form: req.body
    }
    request.get(options, function(error, response, body){
      if(error){
        res.status(500).send(error);
      } else if(response && response.statusCode){
        res.status(response.statusCode).send(response.body);
      }
    })
  });

  // get single schedule through dasher
  app.get('/dasher/schedules/:id', auth.checkJwt, function(req, res) {
    logger.info("getting schedule from dasher");
    var options = {
      url: config.dasher.protocol + '://' + config.dasher.domain + '/schedules/' + req.params['id'],
      // use the same authorization header to use same user account
      headers: {
        'Authorization': req.headers['authorization']
      },
      form: req.body
    }
    request.get(options, function(error, response, body){
      if(error){
        res.status(500).send(error);
      } else if(response && response.statusCode){
        res.status(response.statusCode).send(response.body);
      }
    })
  });

  // post schedule through dasher
  app.post('/dasher/elections/:electionId/schedules', auth.checkJwt, function(req, res) {
    var options = {
      url: config.dasher.protocol + '://' + config.dasher.domain + '/elections/' + req.params['electionId'] + '/schedules/new',
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
        res.status(response.statusCode).send(response.body);
      }
    })
  });

  // update schedule through dasher
  app.put('/dasher/schedules/:id', auth.checkJwt, function(req, res) {
    var options = {
      url: config.dasher.protocol + '://' + config.dasher.domain + '/schedules/' + req.params['id'],
      // use the same authorization header to use same user account
      headers: {
        'Authorization': req.headers['authorization']
      },
      form: req.body
    }
    request.put(options, function(error, response, body){
      if(error){
        res.status(500).send(error);
      } else if(response && response.statusCode){
        res.status(response.statusCode).send(response.body);
      }
    })
  });

  // delete schedule through dasher
  app.delete('/dasher/schedules/:id', auth.checkJwt, function(req, res) {
    var options = {
      url: config.dasher.protocol + '://' + config.dasher.domain + '/schedules/' + req.params['id'],
      // use the same authorization header to use same user account
      headers: {
        'Authorization': req.headers['authorization']
      },
      form: req.body
    }
    request.delete(options, function(error, response, body){
      if(error){
        res.status(500).send(error);
      } else if(response && response.statusCode){
        res.status(response.statusCode).send(response.body);
      }
    })
  });

  // get assignments through dasher
  app.get('/dasher/earlyvotesites/:earlyVoteSiteId/assignments', auth.checkJwt, function(req, res) {
    logger.info("getting assignments from dasher");
    var options = {
      url: config.dasher.protocol + '://' + config.dasher.domain + '/early-vote-sites/' + req.params['earlyVoteSiteId'] + '/assignments',
      // use the same authorization header to use same user account
      headers: {
        'Authorization': req.headers['authorization']
      },
      form: req.body
    }
    request.get(options, function(error, response, body){
      if(error){
        res.status(500).send(error);
      } else if(response && response.statusCode){
        res.status(response.statusCode).send(response.body);
      }
    })
  });

  // get single assignment through dasher
  app.get('/dasher/assignments/:id', auth.checkJwt, function(req, res) {
    logger.info("getting assignment from dasher");
    var options = {
      url: config.dasher.protocol + '://' + config.dasher.domain + '/assignments/' + req.params['id'],
      // use the same authorization header to use same user account
      headers: {
        'Authorization': req.headers['authorization']
      },
      form: req.body
    }
    request.get(options, function(error, response, body){
      if(error){
        res.status(500).send(error);
      } else if(response && response.statusCode){
        res.status(response.statusCode).send(response.body);
      }
    })
  });

  // post assignment through dasher
  app.post('/dasher/earlyvotesites/:earlyVoteSiteId/assignments', auth.checkJwt, function(req, res) {
    var options = {
      url: config.dasher.protocol + '://' + config.dasher.domain + '/early-vote-sites/' + req.params['earlyVoteSiteId'] + '/assignments/new',
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
        res.status(response.statusCode).send(response.body);
      }
    })
  });

  // delete assignment through dasher
  app.delete('/dasher/assignments/:id', auth.checkJwt, function(req, res) {
    var options = {
      url: config.dasher.protocol + '://' + config.dasher.domain + '/assignments/' + req.params['id'],
      // use the same authorization header to use same user account
      headers: {
        'Authorization': req.headers['authorization']
      },
      form: req.body
    }
    request.delete(options, function(error, response, body){
      if(error){
        res.status(500).send(error);
      } else if(response && response.statusCode){
        res.status(response.statusCode).send(response.body);
      }
    })
  });
}

exports.registerDasherServices = registerDasherServices;
