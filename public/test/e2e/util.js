/**
 * Created by rcartier13 on 12/9/13.
 */

// Logging into the application
e2eLogIn = function ($username, $password) {
  input('username').enter($username);
  input('password').enter($password);
  element('#sign-in').click();
};

// Logging out of the application
e2eLogOut = function () {
  element('#pageHeader-sign-out').click();
}
