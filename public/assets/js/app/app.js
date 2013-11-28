'use strict';
/*
 * VIP App
 *
 */

// VIP app module with its dependencies
var vipApp = angular.module('vipApp', ['ngRoute']);

// Constants
vipApp.constant('$appProperties', {
    contextRoot:    '',
    mockServicesPath:   '/mockServices',
    servicesPath:   '/services'
});

/*
 * Static initialization block
 *
 */
vipApp.run(function($rootScope, $appService, $location) {

    // initialize objects
    $rootScope.setPageHeader = function(title, breadcrumbs, section, error){

        this.pageHeader = {};
        this.pageHeader.title = title;
        this.pageHeader.section = section;
        this.pageHeader.breadcrumbs = breadcrumbs;
        this.pageHeader.error = error;
    };

//    $rootScope.setPageHeader(title, section, breadcrumbs, error){

    $rootScope.user = {
        name: null
    };

    // call our reference data service
    $appService.isAuthenticated()
        .success(function (data) {

            console.dir(data);
            console.debug(data===false);

            if(data.isAuthenticated==false){
                $location.path("/");
            }

            $rootScope.user.name = data + " " + Math.ceil(Math.random() * 100);
        }).error(function (data) {

            // if we get an error, we could not connect to the server to check to
            // see if the user is authenticated
            $rootScope.pageHeader.error = "Server Error";
            $location.path("/");

});

});

/*
 * VIP App configuration
 *
 * Will setup routing and retrieve reference data for the app before any pages are loaded
 *
 */
vipApp.config(['$routeProvider','$appProperties','$httpProvider', function ($routeProvider, $appProperties, $httpProvider) {

    $routeProvider.when('/home',{
        templateUrl: $appProperties.contextRoot + '/app/partials/home.html',
        controller: 'HomeCtrl'
    });

    $routeProvider.when('/admin',{
        templateUrl: $appProperties.contextRoot + '/app/partials/admin.html',
        controller: 'AdminCtrl'
    });

    $routeProvider.when('/feeds',{
        templateUrl: $appProperties.contextRoot + '/app/partials/feeds.html',
        controller: 'FeedsCtrl'
    });

    $routeProvider.when('/profile',{
        templateUrl: $appProperties.contextRoot + '/app/partials/profile.html',
        controller: 'ProfileCtrl'
    });

    $routeProvider.when('/styleguide',{
        templateUrl: $appProperties.contextRoot + '/app/partials/styleguide.html',
        controller: 'StyleguideCtrl'
    });

    // default when no path specified
    $routeProvider.otherwise({redirectTo: '/home'});

    /*
     * HTTP Interceptor
     * Will be used to check to see if user is authenticated
     */
    $httpProvider.responseInterceptors.push(function ($q, $location) {
        return function (promise) {
            return promise.then(
                // Success: just return the response
                function (response) {
                    return response;
                },
                // Error: check the error status to get only the 401
                function (response) {
                     if (response.status === 401){
                         $location.url('/');
                     }
                     return $q.reject(response);
                });
        }
    });

}
]);