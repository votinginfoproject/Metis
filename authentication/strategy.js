var logger = (require('../logging/vip-winston')).Logger;

//for developmental testing
var LocalStrategy = require('passport-local').Strategy;

var users = [
  { id: 1, username: 'testuser', password: 'test', email: 'user1@vip.org', givenName: 'Test', surname: 'User', groups: {items: [{name: 'Super Admin'}]} },
  { id: 2, username: 'AK', password: 'test', email: 'test@vip.org', givenName: 'ALASKA', surname: 'STATE', groups: { items: [{name: '02'}]}},
  { id: 3, username: 'AL', password: 'test', email: 'test@vip.org', givenName: 'ALABAMA', surname: 'STATE', groups: { items: [{name: '01'}]}},
  { id: 4, username: 'AR', password: 'test', email: 'test@vip.org', givenName: 'ARKANSAS', surname: 'STATE', groups: { items: [{name: '05'}]}},
  { id: 5, username: 'AS', password: 'test', email: 'test@vip.org', givenName: 'AMERICAN SAMOA', surname: 'TERRITORY', groups: { items: [{name: '60'}]}},
  { id: 6, username: 'AZ', password: 'test', email: 'test@vip.org', givenName: 'ARIZONA', surname: 'STATE', groups: { items: [{name: '04'}]}},
  { id: 7, username: 'CA', password: 'test', email: 'test@vip.org', givenName: 'CALIFORNIA', surname: 'STATE', groups: { items: [{name: '06'}]}},
  { id: 8, username: 'CO', password: 'test', email: 'test@vip.org', givenName: 'COLORADO', surname: 'STATE', groups: { items: [{name: '08'}]}},
  { id: 9, username: 'CT', password: 'test', email: 'test@vip.org', givenName: 'CONNECTICUT', surname: 'STATE', groups: { items: [{name: '09'}]}},
  { id: 10, username: 'DC', password: 'test', email: 'test@vip.org', givenName: 'DISTRICT OF COLUMBIA', surname: 'DISTRICT', groups: { items: [{name: '11'}]}},
  { id: 11, username: 'DE', password: 'test', email: 'test@vip.org', givenName: 'DELAWARE', surname: 'STATE', groups: { items: [{name: '10'}]}},
  { id: 12, username: 'FL', password: 'test', email: 'test@vip.org', givenName: 'FLORIDA', surname: 'STATE', groups: { items: [{name: '12'}]}},
  { id: 13, username: 'GA', password: 'test', email: 'test@vip.org', givenName: 'GEORGIA', surname: 'STATE', groups: { items: [{name: '13'}]}},
  { id: 14, username: 'GU', password: 'test', email: 'test@vip.org', givenName: 'GUAM', surname: 'TERRITORY', groups: { items: [{name: '66'}]}},
  { id: 15, username: 'HI', password: 'test', email: 'test@vip.org', givenName: 'HAWAII', surname: 'STATE', groups: { items: [{name: '15'}]}},
  { id: 16, username: 'IA', password: 'test', email: 'test@vip.org', givenName: 'IOWA', surname: 'STATE', groups: { items: [{name: '19'}]}},
  { id: 17, username: 'ID', password: 'test', email: 'test@vip.org', givenName: 'IDAHO', surname: 'STATE', groups: { items: [{name: '16'}]}},
  { id: 18, username: 'IL', password: 'test', email: 'test@vip.org', givenName: 'ILLINOIS', surname: 'STATE', groups: { items: [{name: '17'}]}},
  { id: 19, username: 'IN', password: 'test', email: 'test@vip.org', givenName: 'INDIANA', surname: 'STATE', groups: { items: [{name: '18'}]}},
  { id: 20, username: 'KS', password: 'test', email: 'test@vip.org', givenName: 'KANSAS', surname: 'STATE', groups: { items: [{name: '20'}]}},
  { id: 21, username: 'KY', password: 'test', email: 'test@vip.org', givenName: 'KENTUCKY', surname: 'STATE', groups: { items: [{name: '21'}]}},
  { id: 22, username: 'LA', password: 'test', email: 'test@vip.org', givenName: 'LOUISIANA', surname: 'STATE', groups: { items: [{name: '22'}]}},
  { id: 23, username: 'MA', password: 'test', email: 'test@vip.org', givenName: 'MASSACHUSETTS', surname: 'STATE', groups: { items: [{name: '25'}]}},
  { id: 24, username: 'MD', password: 'test', email: 'test@vip.org', givenName: 'MARYLAND', surname: 'STATE', groups: { items: [{name: '24'}]}},
  { id: 25, username: 'ME', password: 'test', email: 'test@vip.org', givenName: 'MAINE', surname: 'STATE', groups: { items: [{name: '23'}]}},
  { id: 26, username: 'MI', password: 'test', email: 'test@vip.org', givenName: 'MICHIGAN', surname: 'STATE', groups: { items: [{name: '26'}]}},
  { id: 27, username: 'MN', password: 'test', email: 'test@vip.org', givenName: 'MINNESOTA', surname: 'STATE', groups: { items: [{name: '27'}]}},
  { id: 28, username: 'MO', password: 'test', email: 'test@vip.org', givenName: 'MISSOURI', surname: 'STATE', groups: { items: [{name: '29'}]}},
  { id: 29, username: 'MS', password: 'test', email: 'test@vip.org', givenName: 'MISSISSIPPI', surname: 'STATE', groups: { items: [{name: '28'}]}},
  { id: 30, username: 'MT', password: 'test', email: 'test@vip.org', givenName: 'MONTANA', surname: 'STATE', groups: { items: [{name: '30'}]}},
  { id: 31, username: 'NC', password: 'test', email: 'test@vip.org', givenName: 'NORTH CAROLINA', surname: 'STATE', groups: { items: [{name: '37'}]}},
  { id: 32, username: 'ND', password: 'test', email: 'test@vip.org', givenName: 'NORTH DAKOTA', surname: 'STATE', groups: { items: [{name: '38'}]}},
  { id: 33, username: 'NE', password: 'test', email: 'test@vip.org', givenName: 'NEBRASKA', surname: 'STATE', groups: { items: [{name: '31'}]}},
  { id: 34, username: 'NH', password: 'test', email: 'test@vip.org', givenName: 'NEW HAMPSHIRE', surname: 'STATE', groups: { items: [{name: '33'}]}},
  { id: 35, username: 'NJ', password: 'test', email: 'test@vip.org', givenName: 'NEW JERSEY', surname: 'STATE', groups: { items: [{name: '34'}]}},
  { id: 36, username: 'NM', password: 'test', email: 'test@vip.org', givenName: 'NEW MEXICO', surname: 'STATE', groups: { items: [{name: '35'}]}},
  { id: 37, username: 'NV', password: 'test', email: 'test@vip.org', givenName: 'NEVADA', surname: 'STATE', groups: { items: [{name: '32'}]}},
  { id: 38, username: 'NY', password: 'test', email: 'test@vip.org', givenName: 'NEW YORK', surname: 'STATE', groups: { items: [{name: '36'}]}},
  { id: 39, username: 'OH', password: 'test', email: 'test@vip.org', givenName: 'OHIO', surname: 'STATE', groups: { items: [{name: '39'}]}},
  { id: 40, username: 'OK', password: 'test', email: 'test@vip.org', givenName: 'OKLAHOMA', surname: 'STATE', groups: { items: [{name: '40'}]}},
  { id: 41, username: 'OR', password: 'test', email: 'test@vip.org', givenName: 'OREGON', surname: 'STATE', groups: { items: [{name: '41'}]}},
  { id: 42, username: 'PA', password: 'test', email: 'test@vip.org', givenName: 'PENNSYLVANIA', surname: 'STATE', groups: { items: [{name: '42'}]}},
  { id: 43, username: 'PR', password: 'test', email: 'test@vip.org', givenName: 'PUERTO RICO', surname: 'TERRITORY', groups: { items: [{name: '72'}]}},
  { id: 44, username: 'RI', password: 'test', email: 'test@vip.org', givenName: 'RHODE ISLAND', surname: 'STATE', groups: { items: [{name: '44'}]}},
  { id: 45, username: 'SC', password: 'test', email: 'test@vip.org', givenName: 'SOUTH CAROLINA', surname: 'STATE', groups: { items: [{name: '45'}]}},
  { id: 46, username: 'SD', password: 'test', email: 'test@vip.org', givenName: 'SOUTH DAKOTA', surname: 'STATE', groups: { items: [{name: '46'}]}},
  { id: 47, username: 'TN', password: 'test', email: 'test@vip.org', givenName: 'TENNESSEE', surname: 'STATE', groups: { items: [{name: '47'}]}},
  { id: 48, username: 'TX', password: 'test', email: 'test@vip.org', givenName: 'TEXAS', surname: 'STATE', groups: { items: [{name: '48'}]}},
  { id: 49, username: 'UT', password: 'test', email: 'test@vip.org', givenName: 'UTAH', surname: 'STATE', groups: { items: [{name: '49'}]}},
  { id: 50, username: 'VA', password: 'test', email: 'test@vip.org', givenName: 'VIRGINIA', surname: 'STATE', groups: { items: [{name: '51'}]}},
  { id: 51, username: 'VI', password: 'test', email: 'test@vip.org', givenName: 'VIRGIN ISLANDS', surname: 'ISLANDS', groups: { items: [{name: '78'}]}},
  { id: 52, username: 'VT', password: 'test', email: 'test@vip.org', givenName: 'VERMONT', surname: 'STATE', groups: { items: [{name: '50'}]}},
  { id: 53, username: 'WA', password: 'test', email: 'test@vip.org', givenName: 'WASHINGTON', surname: 'STATE', groups: { items: [{name: '53'}]}},
  { id: 54, username: 'WI', password: 'test', email: 'test@vip.org', givenName: 'WISCONSIN', surname: 'STATE', groups: { items: [{name: '55'}]}},
  { id: 55, username: 'WV', password: 'test', email: 'test@vip.org', givenName: 'WEST VIRGINIA', surname: 'STATE', groups: { items: [{name: '54'}]}},
  { id: 56, username: 'WY', password: 'test', email: 'test@vip.org', givenName: 'WYOMING', surname: 'STATE', groups: { items: [{name: '56'}]}},
];

//Strategy for production
var stormpath = require('stormpath');
var StormpathStrategy = require('passport-stormpath');
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
    var spClient, spApp, strategy;

    spClient = new stormpath.Client({
      apiKey: new stormpath.ApiKey(
          config.auth.apiKey,
          config.auth.apiKeySecret
      )
    });

    var initStormpath = function(attempt) {
      spClient.getApplication(config.auth.appHref, function(err, app) {
        if (err) {
          if(attempt >= 5) { throw err; }
          
          attempt++;
          logger.info('Retrying connection to Stormpath. Attempt ' +
                      attempt + ' of 5.');
          setInterval(initStormpath(attempt), 2000);
        } else {
          spApp = app;
          strategy = new StormpathStrategy({
            spApp: spApp,
            spClient: spClient,
            accountStore: { href: config.auth.accountStore },
            expansions: 'groups,customData'
          });
          logger.info('Initializing Stormpath.');
          passport.use(strategy);
          passport.serializeUser(strategy.serializeUser);
          passport.deserializeUser(strategy.deserializeUser);  
        }
      });  
    }
    
    initStormpath(0);
  }
};

exports.authSetup = setup;