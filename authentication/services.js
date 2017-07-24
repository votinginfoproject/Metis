var config = require('../config');

const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const jwtAuthz = require('express-jwt-authz');
const AuthenticationClient = require('auth0').AuthenticationClient;

// Create middleware for checking the JWT
const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://" + config.auth0.domain + "/.well-known/jwks.json"
  }),

  // Validate the audience and the issuer.
  aud: config.auth0.audience,
  iss: "https://" + config.auth0.domain + "/",
  algorithms: ['RS256']
});

function checkAuth(scope_array) {
  return jwtAuthz(scope_array);
}

var authClient = new AuthenticationClient({
  domain:   config.auth0.domain,
  clientID: config.auth0.clientID,
  clientSecret: config.auth0.secret
});

function getUserFromAccessToken(accessToken, cb) {
  console.log("getting user for accessToken: " + accessToken);
  authClient.users.getInfo(accessToken, function(err, user) {
    if (err) {
      console.log("getUser err");
      console.log(err);
    } else {
      console.log("getUser success?!?");
    }
    cb(user);
  });
}

function registerAuthServices(app) {
  app.post('/services/getUser', function(req, res) {
    var user = getUserFromAccessToken(req.body.accessToken, function(user){
      console.log("user is " + user);
      res.status(200).send(user);
    });
  });
}

exports.checkJwt = checkJwt;
exports.checkAuth = checkAuth;
exports.getUserFromAccessToken = getUserFromAccessToken;
exports.registerAuthServices = registerAuthServices;
