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
  if (config.auth.uselocalauth()) {
    app.post('/login',
      passport.authenticate('local', { failureRedirect: '/#/?badlogin', failureMessage: "Invalid username or password" }),
      loginLocalStrategyPOST);
  } else {
    app.post('/login',
      passport.authenticate('stormpath', { failureRedirect: '/#/?badlogin', failureMessage: "Invalid username or password" }),
      loginStormpathStrategyPOST);
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

loginStormpathStrategyPOST = function(req, res) {

  currentUser = req.user;
  logger.info("in passport success");
  console.log(currentUser.groups.items[0]);

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
      givenName: ((req.user === undefined) ? '' : req.user.givenName),
      surname: ((req.user === undefined) ? '' : req.user.surname),
      userName: ((req.user === undefined) ? '' : req.user.givenName + ' ' + req.user.surname),
      email: ((req.user === undefined) ? '' : req.user.email)
    }
  );
};

partialGetInterceptor = function(req,res,next){

  // if on the home page/login screen, continue as normal
  // with the success html status code
  if(req.path === "/app/partials/home.html" || req.path === "/app/partials/legacy-index-chunk.html"){
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
