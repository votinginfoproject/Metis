var conn = require('./conn.js');
var logger = (require('../logging/vip-winston')).Logger;
var uuidv4 = require('uuid/v4');
var resp = require('./response.js');
var auth = require('../authentication/services.js');

module.exports = {
  simpleQueryCallback: function(sqlQuery, params, callback) {
    conn.query(function(client) {
      client.query(sqlQuery, params, callback);
    });
  },
  simpleQueryResponder: function(sqlQuery, paramsFn) {
    return function(req, res) {

      var callback = function(err, result) {
        if(err) {
          logger.error(err.name + ": " + err.message);
          res.writeHead(500, {'Content-Type': 'text/plain'});
          res.end();
        } else {
          resp.writeResponse(result.rows, res);
        }
      }

      conn.query(function(client) {
        if (paramsFn) {
          client.query(sqlQuery, paramsFn(req), callback);
        } else {
          console.log(sqlQuery);
          client.query(sqlQuery, callback);
        };
      });
    }
  },
  simpleCommandResponder: function(sqlCommand, paramsFn, idFn) {
    return function(req, res) {
      var params = null;
      var callback = function(err, result) {
        if(err) {
          logger.error(err.name + ": " + err.message);
          res.writeHead(500, {'Content-Type': 'text/plain'});
          res.end();
        } else {
          res.writeHead(201, {'Content-Type': 'application/json'});
          if (idFn) {
            res.write(idFn(params));
          } else {
            res.write("{}");
          }
          res.end();
        }
      }

      conn.query(function(client) {
        logger.info("sqlCommand: " + sqlCommand);
        if (paramsFn) {
          params = paramsFn(req);
          logger.info("params: " + params);
          client.query(sqlCommand, params, callback);
        } else {
          client.query(sqlCommand, callback);
        };
      });
    }
  },
  queryParamExtractor: params => req => params.map(param => decodeURIComponent(req.query[param])),
  pathParamExtractor: params => req => params.map(param => decodeURIComponent(req.params[param])),
  bodyParamExtractor: params => req => params.map(param => req.body[param]),
  compoundParamExtractor: paramFns => req => paramFns.reduce((allParams, paramFn) => allParams.concat(paramFn(req)), []),
  uuidGenerator: () => req => ([uuidv4()])
}
