'use strict';
/*
 * VIP App
 *
 */

// VIP app module with its dependencies
var vipApp = angular.module('vipApp', ['ngRoute']);

// Constants
vipApp.constant('$appProperties', {
    contextRoot:    '/vipdashboard',
    servicesPath:   '/vipdashboard/mockServices'
});

/*
 * Static initialization block
 *
 */
vipApp.run(function($rootScope, $appService) {

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
    $appService.getReferenceData()
        .success(function (data) {

            $rootScope.user.name = data + " " + Math.ceil(Math.random() * 100);
        }).error(function (data) {

            $rootScope.pageHeader.error = "Could not retrieve Reference Data for the App."
        });

});

/*
 * VIP App configuration
 *
 * Will setup routing and retrieve reference data for the app before any pages are loaded
 *
 */
vipApp.config(['$routeProvider','$appProperties', function ($routeProvider, $appProperties) {

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

    // default when no path specified
    $routeProvider.otherwise({redirectTo: '/home'});
}
]);