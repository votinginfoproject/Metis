/**
 * Module dependencies.
 */

var config = require('./config');
var express = require('express');
var http = require('http');
var https = require('https');
var path = require('path');
var passport = require('passport');
var auth = require('./auth');
var fs = require('fs');
var logger = require('winston');

var authServices = require('./services/auth');
var feedServices = require('./services/feeds');
var errorServices = require('./services/errors');
var overviewServices = require('./services/overviews');
var geoServices = require('./services/geo');

var app = express();

// Create log folder if it doesn't exist. throw an error if we don't have access to create the folder.
try {
  fs.mkdirSync(config.log.logpath);
} catch(err){
  if(err.code == 'EACCES'){
    throw "Could not create log folder " + err;
  }
}

// adding in a File transport for Winston
logger.add(logger.transports.File,
  { filename: config.log.logpath + config.log.logname,
    level: config.log.loglevel,
    maxsize: 1024 * 1024 * config.log.maxsizeMB,
    maxFiles: config.log.maxFiles
  });

logger.handleExceptions(new logger.transports.File({
    filename: config.log.logpath + config.log.lognameExceptions,
    maxsize: 1024 * 1024 * config.log.maxsizeMB,
    maxFiles: config.log.maxFiles
  }
))

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
feedServices.registerFeedsServices(app);
errorServices.registerErrorServices(app);
overviewServices.registerOverviewServices(app);
geoServices.registerGeoServices(app);

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
