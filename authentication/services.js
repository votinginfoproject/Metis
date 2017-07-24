var config = require('../config');

const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const jwtAuthz = require('express-jwt-authz');

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

exports.checkJwt = checkJwt;
exports.checkAuth = checkAuth;
