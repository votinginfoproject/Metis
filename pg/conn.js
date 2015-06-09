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
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write(JSON.stringify(result.rows, null, "    ") + "\n");
      res.end();
    });
  }
}