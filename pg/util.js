var conn = require('./conn.js');
var resp = require('./response.js');
var logger = (require('../logging/vip-winston')).Logger;

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
  paramExtractor: function(params) {
    return function(req) {
      var ret = [decodeURIComponent(req.params.feedid)];
      if (params) {
        for (var i = 0; i < params.length; i++) {
          ret.push(decodeURIComponent(req.params[params[i]]));
        }
      }
      return ret;
    }
  }
}
