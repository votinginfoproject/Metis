var conn = require('./conn.js')
var logger = (require('../logging/vip-winston')).Logger;
var uuidv4 = require('uuid/v4');
var resp = require('./response.js');

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
          res.write(err.name + ": " + err.message);
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
          res.write(err.name + ": " + err.message);
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
  newIdParamFn: function(params) {
    return function(req) {
      var ret = [uuidv4()];
      if (params) {
        for (var i = 0; i < params.length; i++) {
          ret.push(decodeURIComponent(req.params[params[i]]));
        }
      }
      logger.info(req.params);
      logger.info(ret);
      return ret;
    }
  },
  queryParamExtractor: function(params) {
    return function(req) {
      var ret = [];
      if (params) {
        for (var i = 0; i < params.length; i++) {
          ret.push(decodeURIComponent(req.query[params[i]]));
        }
      }
      return ret;
    }
  },
  pathParamExtractor: function(params) {
    return function(req) {
      var ret = [];
      if (params) {
        for (var i = 0; i < params.length; i++) {
          ret.push(decodeURIComponent(req.params[params[i]]));
        }
      }
      return ret;
    }
  },
  bodyParamExtractor: function(params) {
    return function(req) {
      var ret = [];
      if (params) {
        for (var i = 0; i < params.length; i++) {
          ret.push(req.body[params[i]]);
        }
      }
      return ret;
    }
  },
  compoundParamExtractor: function(paramFns) {
    return function(req) {
      var ret = [];
        for (var i = 0; i < paramFns.length; i++) {
          var params = paramFns[i](req);
          if (params) {
            for (var j = 0; j < params.length; j++) {
              ret.push(params[j]);
            }
          }
        }
      return ret;
    }
  },
  uuidGenerator: function() {
    return function (req) {
      return [uuidv4()];
    }
  }
}
