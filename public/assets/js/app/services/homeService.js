'use strict';
/*
 * Home Service
 *
 * Returning promises, allowing the Controller to handle success and error responses appropriately
 *
 */
vipApp.factory('$homeService', function ($http, $appProperties) {

    return {
        getData: function () {
            return $http.get($appProperties.mockServicesPath + "/homeMockService.html");
        },
        postService: function () {
            var postData = {key: "One", value: "1"};

            return $http.post("http://www.google.com", data);
        }
    };
});