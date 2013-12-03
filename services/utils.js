/**
 * Created by bantonides on 12/3/13.
 */
/*
 * Utility methods
 */
ensureAuthentication = function (req, res, next) {
  if (!req.isAuthenticated())
    res.send(401);
  else
    next();
};

exports.ensureAuthentication = ensureAuthentication;