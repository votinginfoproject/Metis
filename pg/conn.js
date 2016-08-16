var resp = require('./response.js');
var pg = require('pg');
var logger = (require('../logging/vip-winston')).Logger;

var config = {
  user: process.env.DB_ENV_POSTGRES_USER,
  database: process.env.DB_ENV_POSTGRES_DATABASE,
  password: process.env.DB_ENV_POSTGRES_PASSWORD,
  port: process.env.DB_PORT_5432_TCP_PORT,
  max: 10, // clients in the connection pool
  idleTimeoutMillis: 500000
};

var pool = new pg.Pool(config);

var queryFromPool = function(callback) {
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    else {
      callback(client);
    }
    done();
});

  pool.on('error', function (err, client) {
    logger.crit('*** WOWZERS *** idle client error', err.message, err.stack);
    console.error('*** BONKERS *** idle client error', err.message, err.stack);
  });
}

module.exports = {
  query: queryFromPool
};
