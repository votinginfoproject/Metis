var resp = require('./response.js');
var pg = require('pg');
var logger = (require('../logging/vip-winston')).Logger;

module.exports = {
  query: function(callback) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      if (err) {
        logger.crit(err);
      } else {
        callback(client);
      }
      done();
    });
  }
};
