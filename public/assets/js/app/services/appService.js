'use strict';
/*
 * App Service to retrieve reference data for the app
 *
 * Returning promises, allowing the Controller to handle success and error responses appropriately
 *
 */
vipApp.factory('$appService', function ($http, $appProperties) {

    return {
        isAuthenticated: function () {
            return $http.get($appProperties.servicesPath + "/isAuthenticated");
        },
        getReferenceData: function () {
            return $http.get($appProperties.mockServicesPath + "/referenceDataMockService.html");
        },
        postService: function () {
            var postData = {key: "One", value: "1"};

            return $http.post("http://www.google.com", data);
        }
    };
});