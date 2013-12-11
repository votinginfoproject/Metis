/**
 * Created by rcartier13 on 12/9/13.
 */

var testGlobals = {
  appRootUrl: "http://localhost:4000",
  appFeedsUrl: "http://localhost:4000/#/feeds",
  sleepTime: 0.5
};

// Logging into the application
e2eLogIn = function ($username, $password) {
  e2eLoadPage(testGlobals.appRootUrl);
  input('username').enter($username);
  input('password').enter($password);
  element('#sign-in').click();
  sleep(testGlobals.sleepTime);
  expect(element('#username').count()).toBe(0);
};

// Logging out of the application
e2eLogOut = function () {
  element('#pageHeader-sign-out').click();
  sleep(testGlobals.sleepTime);
  expect(element('#username').count()).toBe(1);
}

e2eLoadPage = function ($url) {
  browser().navigateTo($url);
  sleep(testGlobals.sleepTime);
}

e2eValueofRepeater = function ($name, $binding) {
  // Ugly code on how to get a value from a future
  // Gets the future from the first date in the table
  var val = repeater($name).column($binding);
  // Executes that future populating its value function
  val.execute(function() {});
  // Sets a variable to that futures value
  return val.value;
};
