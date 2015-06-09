var resp = require('./response.js');

module.exports = {
  // Open the connection
  openPostgres: function() {
    var pg = require('pg');
    var connString = process.env.DATABASE_URL;

    var client = new pg.Client(connString);
    client.connect();
    return client;
  },
  // Close the connection
  closePostgres: function(query, client, res) {
    query.on("end", function (result) {
      client.end();
      resp.writeResponse(result.rows, res)
    });
  }
}