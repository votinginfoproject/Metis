'use strict';
/*
 * VIP App
 *
 */

// VIP app module with its dependencies
var vipApp = angular.module('vipApp', ['ngRoute','ngCookies']);

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

    console.log("run()");

    $rootScope.pageHeader = {};
    $rootScope.user = null;

    /*
     * Sets PageHeader values
     *
     * @param title - the Title of the page
     * @breadcrumbs - the breadcrumbs
     * @section - section name used for the navigation bar "home", "admin", "feeds", "profile"
     * @error - error message to show on the screen
     */
    $rootScope.setPageHeader = function(title, breadcrumbs, section, error){

        this.pageHeader = {};
        this.pageHeader.title = title;
        this.pageHeader.section = section;
        this.pageHeader.breadcrumbs = breadcrumbs;
        this.pageHeader.error = error;
    };

    // Before we render any pages,
    // see if user is authenticated or not and take appropriate action
    $appService.getUser()
        .success(function (data) {

            // set user object
            $rootScope.user = data;

            // redirect to home page if not authenticated
            if(data.isAuthenticated==false){
                $location.path("/");
            }

        }).error(function (data) {

            // if we get an error, we could not connect to the server to check to
            // see if the user is authenticated, this should not happen
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
vipApp.config(['$routeProvider','$appProperties','$httpProvider',
    function ($routeProvider, $appProperties, $httpProvider) {

    console.log("config()");

    $routeProvider.when('/',{
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
    $routeProvider.otherwise({redirectTo: '/'});


//    $httpProvider

    /*
     * HTTP Interceptor
     * Will be used to check to see if user is authenticated
     */
    $httpProvider.responseInterceptors.push(function ($q, $location) {
        return function (promise) {
            return promise.then(
                // Success: just return the response
                function (response) {
                    //console.dir(response.headers());
                    //console.dir(response);

                    return response;
                },
                // Error: check the error status for 401
                // and if so redirect back to homepage
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