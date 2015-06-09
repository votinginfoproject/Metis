module.exports = {
  // Write the results
  writeResponse: function(result, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(result, null, "    ") + "\n");
    res.end();
  }
}