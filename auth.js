/**
 * Created by bantonides on 11/22/13.
 */

//for developmental testing
//TODO: Remove this authentication code and use Crowd
var LocalStrategy = require('passport-local').Strategy;
var users = [
  { id: 1, username: 'testuser', password: 'test', email: 'user1@vip.org', givenName: 'Test', surname: 'User', groups: {items: [{name: 'Super Admin'}]} },
  { id: 2, username: 'testuser2', password: 'test2', email: 'user2@vip.org', givenName: 'Test', surname: 'User2', groups: {items: [{name: 'Super Admin'}]} }
];

//Strategy for production
var StormpathStrategy = require('passport-stormpath').Strategy;
var _ = require('underscore');

//logged in user profiles
var profiles = [];

function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}

var setup = function (config, passport, isDevelopment) {
  if (isDevelopment) {
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
  } else {
    var strategy = new StormpathStrategy(
      {apiKeyId: config.auth.apiKey,
       apiKeySecret: config.auth.apiKeySecret,
       appHref: config.auth.appHref,
       accountStore: { href: config.auth.accountStore },
       expansions: 'groups,customData'},
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
      });
    passport.use(strategy);
    passport.serializeUser(strategy.serializeUser);
    passport.deserializeUser(strategy.deserializeUser);
  }
};

exports.authSetup = setup;
