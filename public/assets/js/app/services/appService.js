'use strict';
/*
 * App Service to retrieve reference data for the app
 *
 * Returning promises, allowing the Controller to handle success and error responses appropriately
 *
 */
vipApp.factory('$appService', function ($http, $appProperties) {

    return {
        // gets the User object from the server
        getUser: function () {
            // adding in the timestamp so that IE does not Cache this service
            return $http.get($appProperties.servicesPath + "/getUser" + "?t=" + Math.random());
        },
        getReferenceData: function () {
            return $http.get($appProperties.mockServicesPath + "/referenceDataMockService.html");
        }
    };
});