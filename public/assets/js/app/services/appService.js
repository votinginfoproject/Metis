'use strict';
/*
 * App Service to retrieve reference data for the app
 *
 * Returning promises, allowing the Controller to handle success and error responses appropriately
 *
 */
vipApp.factory('$appService', function ($http, $appProperties, $rootScope, $location) {

  

    return {
        // gets the User object from the server and updates root scope
        setUserSuccess: function (data) {
          $rootScope.user = data
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
