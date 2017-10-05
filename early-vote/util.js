var conn = require('./conn.js')
var logger = (require('../logging/vip-winston')).Logger;
var resp = require('../pg/response.js');
var uuidv4 = require('uuid/v4');

module.exports = {
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
          client.query(sqlQuery, callback);
        };
      });
    }
  },
  simpleCommandResponder: function(sqlCommand, paramsFn) {
    return function(req, res) {
      var callback = function(err, result) {
        if(err) {
          logger.error(err.name + ": " + err.message);
          res.writeHead(500, {'Content-Type': 'text/plain'});
          res.write(err.name + ": " + err.message);
          res.end();
        } else {
          res.writeHead(201, {'Content-Type': 'application/json'});
          res.write("{}");
          res.end();
        }
      }

      conn.query(function(client) {
        logger.info("sqlCommand: " + sqlCommand);
        if (paramsFn) {
          params = paramsFn(req);
          logger.info("params: " + params);
          client.query(sqlCommand, paramsFn(req), callback);
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
  }
}
