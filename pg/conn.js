module.exports = {
  // Open the connection
  openPostgres: function() {
    var pg = require('pg');
    var connString = process.env.DATABASE_URL;

    var client = new pg.Client(connString);
    client.connect();
    return client;
  },
  writeResponse: function(result, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(result, null, "    ") + "\n");
    res.end();
  },
  // Close the connection
  closePostgres: function(query, client, res) {
    query.on("end", function (result) {
      client.end();
      this.writeResponse(result.rows, res)
    });
  }
}