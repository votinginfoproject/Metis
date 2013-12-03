/**
 * Module dependencies.
 */

var config = require('./config');
var express = require('express');
var http = require('http');
var path = require('path');
var passport = require('passport');
var auth = require('./auth');

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

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//user authentication
auth.authSetup(config, passport, config.crowd.uselocalauth);

//TODO: remove this check and just use Crowd for authentication
if (config.crowd.uselocalauth) {
  app.post('/login',
    passport.authenticate('local', { failureRedirect: '/#/?badlogin', failureMessage: "Invalid username or password" }),
    function(req, res) {

      console.log("in passport success");

      // successfull login, go to the feeds page afterwards
      res.redirect('/#/feeds');
    });


} else {
  app.post('/login',
    passport.authenticate('atlassian-crowd', { failureRedirect: '/#/?badlogin', failureMessage: "Invalid username or password" }),
    function(req, res) {

      console.log("in passport success");

      // successfull login, go to the feeds page afterwards
      res.redirect('/#/feeds');
    });
}

/*
 * Rest Endpoint - log out the user
 *
 */
app.get('/logout', function(req,res){

    // logout the user here
    req.logout();
    res.redirect('/');
});

/*
 * Rest Endpoint - returns User Object
 *
 * @return a user object with the isAuthenticated attribute as true if authenticated, false otherwise
 */
app.get('/services/getUser', function(req,res){
    // return a JSON response
    res.json(
        {
            isAuthenticated: req.isAuthenticated(),
            userName: ((req.user === undefined) ? '' : req.user.name.givenName + ' ' + req.user.name.familyName)
        }
    );
});

/*
 * HTTP Get interceptor
 *
 * We want to authenticate the user on any HTTP Get request. If the path is for the
 * home/login page, then we continue as normal, otherwise we return a http status code of 401
 */
app.get('/app/partials/*', function(req,res,next){

    // if on the home page/login screen, continue as normal
    // with the success html status code
    if(req.path==="/app/partials/home.html"){
        next();
    } else {
        auth.authCheck(req,res,next);
    }
});

http.createServer(app).listen(config.web.port, function() {
  console.log('Express server listening on port ' + config.web.port);
});
