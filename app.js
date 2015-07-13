/**
 * Module dependencies.
 */
var logger = (require('./logging/vip-winston')).Logger;

var config = require('./config');
var express = require('express');
var http = require('http');
var https = require('https');
var path = require('path');
var passport = require('passport');
var auth = require('./auth');
var fs = require('fs');

var authServices = require('./services/auth');
var pgServices = require('./pg/services');

if (fs.existsSync('./newrelic.js')) {
  require('newrelic');
}

var app = express();

logger.info('=========================================================');
logger.info('VIP App Started');
logger.info('=========================================================');

// all environments
app.use(express.favicon(config.web.favicon));
app.use(express.logger(config.web.loglevel));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ secret: config.web.sessionsecret }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/feeds', express.directory(path.join(__dirname, 'feeds')));
app.use('/feeds', express.static(path.join(__dirname, 'feeds')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  logger.info('Running in Development Mode.');
}

//user authentication
auth.authSetup(config, passport, config.crowd.uselocalauth);

//register REST services
authServices.registerAuthServices(config, app, passport);
pgServices.registerPostgresServices(app);

if (config.web.enableSSL) {
  var opts = {
    key: fs.readFileSync(config.web.SSLKey),
    cert: fs.readFileSync(config.web.SSLCert)
  };

  https.createServer(opts, app).listen(config.web.port, function() {
    logger.info('Express server listening on port ' + config.web.port);
  });
} else {
  http.createServer(app).listen(config.web.port, function () {
    logger.info('Express server listening on port ' + config.web.port);
  });
}

var pg = require('pg');
var connString = "postgres://" + process.env.DB_ENV_POSTGRES_USER +
                 ":" + process.env.DB_ENV_POSTGRES_PASSWORD +
                 "@" + process.env.DB_PORT_5432_TCP_ADDR +
                 ":" + process.env.DB_PORT_5432_TCP_PORT;
process.env.DATABASE_URL = connString;

pg.connect(connString, function(err, client, done) {
  if(err) {
    return logger.error('Could not connect to PostgreSQL. Error fetching client from pool: ', err);
  }

  logger.info('Connected to PostgreSQL.');
});
