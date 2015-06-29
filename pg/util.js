var conn = require('./conn.js');

module.exports = {
  simpleQueryResponder: function(sqlQuery, paramsFn) {
    return function(req, res) {
      var query;
      var client = conn.openPostgres();
      if (paramsFn) {
        query = client.query(sqlQuery, paramsFn(req));
      } else {
        query = client.query(sqlQuery);
      };

      query.on("row", function (row, result) {
        result.addRow(row);
      });

      conn.closePostgres(query, client, res);
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
