/**
 * Created by rcartier13 on 12/9/13.
 */

var testGlobals = {
  appRootUrl: "http://localhost:4000"

};

// Logging into the application
e2eLogIn = function ($username, $password) {
  e2eLoadPage(testGlobals.appRootUrl);
  input('username').enter($username);
  input('password').enter($password);
  element('#sign-in').click();
  sleep(0.5);
};

// Logging out of the application
e2eLogOut = function () {
  element('#pageHeader-sign-out').click();
  sleep(0.5);
}

e2eLoadPage = function ($url) {
  browser().navigateTo($url);
  sleep(0.5);
}
