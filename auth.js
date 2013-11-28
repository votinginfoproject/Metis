/**
 * Created by bantonides on 11/22/13.
 */

//for developmental testing
//TODO: Remove this authentication code and use Crowd
var LocalStrategy = require('passport-local').Strategy;
var users = [
  { id: 1, username: 'testuser', password: 'test', email: 'user1@vip.org' },
  { id: 2, username: 'testuser2', password: 'test2', email: 'user2@cip.org' }
];

function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}
//Strategy for production
var CrowdStrategy = require('passport-atlassian-crowd').Strategy;
var _ = require('underscore');
var passport;

//logged in user profiles
var profiles = [];

var setup = function (config, pp, isDevelopment) {
  passport = pp;

  passport.serializeUser(function (user, done) {
    done(null, user.username);
  });


  if (isDevelopment) {

    passport.deserializeUser(function (username, done) {
        var user = {};
        user.username = username;

        done(null, user);
    });

    passport.use(new LocalStrategy(
      function(username, password, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {

          // Find the user by username.  If there is no user with the given
          // username, or the password is not correct, set the user to `false` to
          // indicate failure and set a flash message.  Otherwise, return the
          // authenticated `user`.
          findByUsername(username, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
            if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
            profiles.push(user);
            return done(null, user);
          })
        });
      }
    ));

  } else {

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

  }
};

/*
 * Get the current authenticated user's username
 *
 * @Return null if no user is authenticated, else the username
 */
getUserName = function () {
    if(profiles===null || profiles.length===0){
        return null;
    } else {
        return profiles.pop().username;
    }
};

check = function (req, res, next) {
  if (!req.isAuthenticated())
    res.send(401);
  else
    next();
};

exports.authSetup = setup;
exports.authCheck = check;
exports.getUserName = getUserName;
