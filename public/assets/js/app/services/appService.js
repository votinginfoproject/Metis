'use strict';
/*
 * App Service to retrieve reference data for the app
 *
 * Returning promises, allowing the Controller to handle success and error responses appropriately
 *
 */
vipApp.factory('$appService', function ($http, $appProperties, $authService) {

    return {
        // gets the User object from the server
        getUser: function () {
            // adding in the timestamp so that IE does not Cache this service
            return $http.post($appProperties.servicesPath + "/getUser",
                              {accessToken: $authService.getAccessToken()});
        }
    };
});
