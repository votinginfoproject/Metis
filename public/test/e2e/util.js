/**
 * Created by rcartier13 on 12/9/13.
 */

var testGlobals = {
  appRootUrl: "http://localhost:4000",
  appFeedsUrl: "http://localhost:4000/#/feeds",
  sleepTime: 0.5
};

// Logging into the application
function e2eLogIn ($username, $password) {
  e2eLoadPage(testGlobals.appRootUrl);
  input('username').enter($username);
  input('password').enter($password);
  element('#sign-in').click();
  sleep(testGlobals.sleepTime);
  expect(element('#username').count()).toBe(0);
};

// Logging out of the application
function e2eLogOut () {
  element('#pageHeader-sign-out').click();
  sleep(testGlobals.sleepTime);
  expect(element('#username').count()).toBe(1);
}

function e2eLoadPage ($url) {
  browser().navigateTo($url);
  sleep(testGlobals.sleepTime);
}
