/**
 * Created by bantonides on 11/22/13.
 */

var CrowdStrategy = require('passport-atlassian-crowd').Strategy;
var _ = require('underscore');
var passport;

//logged in user profiles
var profiles = [];

var setup = function(config, pp) {
    passport = pp;

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
};

var login = function (req, options) {
    passport.authenticate('atlassian-crowd', { failureRedirect: '/loginfail'});
};

var check = function(req, res, next) {
  if (!req.isAuthenticated())
    res.send(401);
  else
    next();
};

exports.authSetup = setup;
exports.authLogin = login;
exports.authCheck = check;
