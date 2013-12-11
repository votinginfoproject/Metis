/**
 * Created by rcartier13 on 12/9/13.
 */

// Logging into the application
e2eLogIn = function ($username, $password) {
  input('username').enter($username);
  input('password').enter($password);
  element('#sign-in').click();
  sleep(0.2);
};

// Logging out of the application
e2eLogOut = function () {
  element('#pageHeader-sign-out').click();
  sleep(0.2);
}

e2eLoadPage = function () {
  browser().navigateTo('http://localhost:4000');
  sleep(0.2);
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
