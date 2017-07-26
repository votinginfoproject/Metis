'use strict';
/*
 * App Service to retrieve reference data for the app
 *
 * Returning promises, allowing the Controller to handle success and error responses appropriately
 *
 */
vipApp.factory('$appService', function ($http, $appProperties, $rootScope, $location) {

  function userToFips(data) {
    if (data && data.app_metadata && data.app_metadata.fipsCodes) {
      return Object.keys(data.app_metadata.fipsCodes);
    } else {
      return [];
    }
  };

  function userToGivenName(data) {
    if (data && data.user_metadata && data.user_metadata.givenName) {
      return data.user_metadata.givenName;
    } else if (data && data.name) {
      return data.name;
    } else if (data && data.nickname) {
      return data.nickname;
    } else if (data && data.email) {
      return data.email;
    } else {
      return "User";
    }
  }

    return {
        // gets the User object from the server and updates root scope
        setUserSuccess: function (data) {
          $rootScope.user = {isAuthenticated: true,
                             givenName: userToGivenName(data),
                             userName: data["name"],
                             email: data["email"],
                             fipsCodes: userToFips(data)}
        },
        setUserFailure: function (data) {
          $rootScope.pageHeader.error = "Unauthenticated";
          $location.path("/");
        },
        clearUser: function() {
          $rootScope.user = null;
        }
    };
});
