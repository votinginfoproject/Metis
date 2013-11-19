'use strict';
/*
 * VIP App
 *
 */

// vip app module with its dependencies
var vipApp = angular.module('vipApp', ['ngRoute']);

//vipApp.constant('Vader', "ds");

// vip app routing
vipApp.config(['$routeProvider', function ($routeProvider) {

    $routeProvider.when('/home',{
        templateUrl: 'app/partials/home.html',
        controller: 'HomeCtrl'
    });

    $routeProvider.when('/admin',{
        templateUrl: 'app/partials/admin.html',
        controller: 'AdminCtrl'
    });

    $routeProvider.when('/feeds',{
        templateUrl: 'app/partials/feeds.html',
        controller: 'FeedsCtrl'
    });

    $routeProvider.when('/profile',{
        templateUrl: 'app/partials/profile.html',
        controller: 'ProfileCtrl'
    });

    // no path specified
    $routeProvider.otherwise({redirectTo: '/home'});
}
]);
