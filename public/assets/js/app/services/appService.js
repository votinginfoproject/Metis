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
        getUser: function (accessToken) {
            $http.post($appProperties.servicesPath + "/getUser",
                       {accessToken: accessToken})
                 .success(function (data) {
                          console.log("getUser results: " + data);
                         // set user object
                         $rootScope.user = {isAuthenticated: true,
                                            givenName: "Given",
                                            surName: "Sur",
                                            userName: data["name"],
                                            email: "email"}

                         // redirect to home page if not authenticated
                         if (data ===null) {
                           $rootScope.pageHeader.error = "Unauthenticated";
                           $location.path("/");
                         }

                       }).error(function (data) {

                         // if we get an error, we could not connect to the server to check to
                         // see if the user is authenticated, this should not happen
                         $rootScope.pageHeader.error = "Server Error";
                         $location.path("/");
                       });
        },
        clearUser: function() {
          $rootScope.user = null;
        }
    };
});
