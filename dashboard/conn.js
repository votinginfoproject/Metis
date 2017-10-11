var pg = require('pg');
var logger = (require('../logging/vip-winston')).Logger;

var config = {
  host: process.env.DASHBOARD_DB_PORT_5432_TCP_ADDR,
  user: process.env.DASHBOARD_DB_ENV_POSTGRES_USER,
  database: process.env.DASHBOARD_DB_ENV_POSTGRES_DATABASE,
  password: process.env.DASHBOARD_DB_ENV_POSTGRES_PASSWORD,
  port: process.env.DASHBOARD_DB_PORT_5432_TCP_PORT,
  max: 10, // clients in the connection pool
  idleTimeoutMillis: 300000,
  application_name: 'early-vote'
};

var pool = new pg.Pool(config);

var queryFromPool = function(callback) {
  pool.connect(function(err, client, done) {
    if (err) {
      logger.crit('error fetching client from pool', err);
    }
    else {
      callback(client);
    }
    done();
});
}

module.exports = {
  query: queryFromPool
};
