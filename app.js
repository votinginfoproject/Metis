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

var authServices = require('./services/auth');
var feedServices = require('./services/feeds');
var errorServices = require('./services/errors');
var overviewServices = require('./services/overviews');
var geoServices = require('./services/geo');

var app = express();


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
app.use(express.directory(path.join(__dirname, 'feeds')));
app.use(express.static(path.join(__dirname, 'feeds')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
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
    console.log('Express server listening on port ' + config.web.port);
  });
} else {
  http.createServer(app).listen(config.web.port, function () {
    console.log('Express server listening on port ' + config.web.port);
  });
}
