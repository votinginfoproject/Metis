/**
 * Module dependencies.
 */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

var logger = (require('./logging/vip-winston')).Logger;

var config = require('./config');
var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var queue = require('./queue');

var notificationServices = require('./notifications/services');
var pgServices = require('./pg/services');
var dataVerificationServices = require('./data-testing/services');
var authServices = require('./authentication/services.js');

if (fs.existsSync('./newrelic.js')) {
  require('newrelic');
}

var app = express();

queue.connect();

logger.info('=========================================================');
logger.info('VIP App Started');
logger.info('=========================================================');

var redirectHttps = function(req, res, next) {
  if (req.header("X-Forwarded-Proto") === "http" && req.path !== "/ping") {
    res.redirect("https://" + req.headers.host);
  } else {
    next();
  }
};

// FileSession
var FileStore = require('session-file-store')(express.session);
var sessionFileStore = new FileStore(config.session);

// all environments
app.use(express.compress());
app.use(express.favicon(config.web.favicon));
app.use(express.logger(config.web.loglevel));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ store: sessionFileStore, secret: config.web.sessionsecret }));

// Redirect non-https load balanced clients to https
app.use(redirectHttps);
// /ping for load balancer health checking
app.get('/ping', function (req, res, next) { res.send('pong'); });

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/feeds', express.directory(path.join(__dirname, 'feeds')));
app.use('/feeds', express.static(path.join(__dirname, 'feeds')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  logger.info('Running in Development Mode.');
}

//register REST services
notificationServices.registerNotificationServices(app);
pgServices.registerPostgresServices(app);
dataVerificationServices.registerDataVerificationServices(app);

app.get ('/config/vit', authServices.checkJwt, function (req, res, next) {
  res.send(config.vit.apiKey);
});

http.createServer(app).listen(config.web.port, function () {
  logger.info('Express server listening on port ' + config.web.port);
});

var pg = require('pg');
var connString = "postgres://" + process.env.DB_ENV_POSTGRES_USER +
                 ":" + process.env.DB_ENV_POSTGRES_PASSWORD +
                 "@" + process.env.DB_PORT_5432_TCP_ADDR +
                 ":" + process.env.DB_PORT_5432_TCP_PORT +
                 "/" + process.env.DB_ENV_POSTGRES_DATABASE +
                 "?application_name=dashboard";
process.env.DATABASE_URL = connString;

pg.connect(connString, function(err, client, done) {
  if(err) {
    return logger.error('Could not connect to PostgreSQL. Error fetching client from pool: ', err);
  }

  logger.info('Connected to PostgreSQL. May your queries terminate before a 3 minute timeout.');
});
