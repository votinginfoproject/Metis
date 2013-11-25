/**
 * Module dependencies.
 */

var config = require('./config');
var express = require('express');
var http = require('http');
var path = require('path');
var passport = require('passport');
var CrowdStrategy = require('passport-atlassian-crowd').Strategy;
var _ = require('underscore');
var auth = require('./auth');

var app = express();

//logged in user profiles
var profiles = [];

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

//user serialization
passport.serializeUser(function (user, done) {
    done(null, user.username);
});

passport.deserializeUser(function (username, done) {
    var user = _.find(profiles, function (user) {
        return user.username == username;
    });
    if (user === undefined) {
        done(new Error("No user with username '" + username + "' found."));
    }
    else {
        done(null, user);
    }
});

passport.use(new CrowdStrategy({
        crowdServer: config.crowd.server,
        crowdApplication: config.crowd.application,
        crowdApplicationPassword: config.crowd.apppass,
        retrieveGroupMemberships: config.crowd.retrieveGroups
    },
    function (userprofile, done) {
        process.nextTick(function () {
            var exists = _.any(profiles, function (user) {
                return user.id == userprofile.id;
            });
            if (!exists) {
                profiles.push(userprofile);
            }
            return done(null, userprofile);
        })
    }
));

app.post('/login',
    passport.authenticate('atlassian-crowd', { failureRedirect: '/loginfail'}),
    function(req, res) {
        res.redirect('/');
    });


http.createServer(app).listen(config.web.port, function () {
    console.log('Express server listening on port ' + config.web.port);
});
