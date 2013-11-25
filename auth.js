/**
 * Created by bantonides on 11/22/13.
 */
var authCheck = function(req, res, next) {
  if (!req.isAuthenticated())
    res.send(401);
  else
    next();
};

exports.authCheck = authCheck;