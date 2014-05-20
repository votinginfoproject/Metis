/**
 * Created by bantonides on 12/3/13.
 */
var utils = require('./utils');
var logger = (require('../logging/vip-winston')).Logger;


var currentUser = null;

var registerAuthServices = function(config, app, passport) {
  /*
   * Rest Endpoints associated with authentication and identity
   */

  /*
   * Log in the user
   */
  //TODO: remove this check and just use Crowd for authentication
  if (config.crowd.uselocalauth) {
    app.post('/login',
      passport.authenticate('local', { failureRedirect: '/#/?badlogin', failureMessage: "Invalid username or password" }),
      loginLocalStrategyPOST);
  } else {
    app.post('/login',
      passport.authenticate('atlassian-crowd', { failureRedirect: '/#/?badlogin', failureMessage: "Invalid username or password" }),
      loginCrowdStrategyPOST);
  }

  /*
   * Log out the user
   */
  app.get('/logout', logoutGET);

  /*
   * Returns User Object
   *
   * @return a user object with the isAuthenticated attribute as true if authenticated, false otherwise
   */
  app.get('/services/getUser', userGET);

  /*
   * HTTP Get interceptor
   *
   * We want to authenticate the user on any HTTP Get request. If the path is for the
   * home/login page, then we continue as normal, otherwise we return a http status code of 401
   */
  app.get('/app/partials/*', partialGetInterceptor);


};

/*
 * Callbacks for HTTP verbs
 */
loginLocalStrategyPOST = function(req, res) {

  currentUser = req.user;
  logger.info("in local auth success");

  // successful login, go to the feeds page afterwards
  res.redirect('/#/feeds');
};

loginCrowdStrategyPOST = function(req, res) {

  currentUser = req.user;
  logger.info("in passport success");

  // successful login, go to the feeds page afterwards
  res.redirect('/#/feeds');
};

logoutGET = function(req,res){

  currentUser = null;
  // logout the user here
  req.logout();
  res.redirect('/');
};

userGET = function(req,res){
  // return a JSON response
  res.json(
    {
      isAuthenticated: req.isAuthenticated(),
      userName: ((req.user === undefined) ? '' : req.user.name.givenName + ' ' + req.user.name.familyName)
    }
  );
};

partialGetInterceptor = function(req,res,next){

  // if on the home page/login screen, continue as normal
  // with the success html status code
  if(req.path==="/app/partials/home.html"){
    next();
  } else {
    utils.ensureAuthentication(req,res,next);
  }
};

getCurrentUser = function(){
  return currentUser;
}

exports.getCurrentUser = getCurrentUser;
exports.registerAuthServices = registerAuthServices;