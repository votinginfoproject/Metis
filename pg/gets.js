var conn = require('./conn.js');

module.exports = {
  // Functions below return arrays for the various queries with the requirement of an ID.
  getResults: function(req, res) {
    var client = conn.openPostgres();
    var query = client.query("SELECT * FROM results WHERE id=" + req.query.id);

    query.on("row", function (row, result) {
      result.addRow(row);
    });

    conn.closePostgres(query, client, res);
  },
  getValidations: function(req, res) {
    var client = conn.openPostgres();
    var query = client.query("SELECT * FROM validations WHERE result_id=" + req.query.id);

    query.on("row", function (row, result) {
      result.addRow(row);
    });

    query.on("end", function (result) {
      var edn = require("jsedn");

      for (i = 0; i < result.rows.length; i++) {
        var parsed_message = edn.toJS(edn.parse(result.rows[i]["message"]));
        result.rows[i]["message"] = parsed_message;
      }

      client.end();
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write(JSON.stringify(result.rows, null, "    ") + "\n");
      res.end();
    });
  },
  getValidationsErrorCount: function(req, res) {
    var client = conn.openPostgres();
    var query = client.query("SELECT message FROM validations WHERE result_id=" + req.query.id);

    query.on("row", function (row, result) {
      result.addRow(row);
    });

    query.on("end", function (result) {
      var edn = require("jsedn");
      var count = 0;
      
      for (i = 0; i < result.rows.length; i++) {
        var parsed_message = edn.toJS(edn.parse(result.rows[i]["message"]));
        count += parsed_message.length || 1;
      }

      client.end();
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write(JSON.stringify(count, null, "    ") + "\n");
      res.end();
    });
  }
}