/**
 * Module dependencies.
 */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

var logger = (require('./logging/vip-winston')).Logger;

var config = require('./config');

var compress = require('compression');
var express = require('express');
var favicon = require('express-favicon');
var morgan = require('morgan');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var serveIndex = require('serve-index');
var errorhandler = require('errorhandler');

var http = require('http');
var path = require('path');
var fs = require('fs');
var queue = require('./queue');

var notificationServices = require('./notifications/services');
var pgServices = require('./pg/services');
var dataVerificationServices = require('./aws/services');
var authServices = require('./authentication/services');
var centralizationServices = require('./aws/services');
var earlyVoteServices = require('./early-vote/services');
var dasherServices = require('./dasher/services');

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

// all environments
app.use(compress());
app.use(favicon(config.web.favicon));
// Do we need to configure the log-level for morgan? This got reset to
// the default after we bumped dependencies in June 2018.
app.use(morgan());
app.use(express.json());
app.use(express.urlencoded());
app.use(methodOverride());
app.use(cookieParser());

// Redirect non-https load balanced clients to https
app.use(redirectHttps);
// /ping for load balancer health checking
app.get('/ping', function (req, res, next) { res.send('pong'); });

app.use(express.static(path.join(__dirname, 'public')));
app.use('/feeds', serveIndex(path.join(__dirname, 'feeds')));
app.use('/feeds', express.static(path.join(__dirname, 'feeds')));

// development only
if ('development' == app.get('env')) {
  app.use(errorhandler());
  logger.info('Running in Development Mode.');
}

//register REST services
notificationServices.registerNotificationServices(app);
pgServices.registerPostgresServices(app);
dataVerificationServices.registerDataVerificationServices(app);
authServices.registerAuthServices(app);
centralizationServices.registerCentralizationServices(app);
earlyVoteServices.registerEarlyVoteServices(app);
dasherServices.registerDasherServices(app);

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
