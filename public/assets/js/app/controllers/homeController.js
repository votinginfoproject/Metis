'use strict';
/*
 * Home Controller
 *
 */
function HomeCtrl($scope, $rootScope, $homeService, $routeParams){

    var breadcrumbs = null;
    // initialize page header variables
    $rootScope.setPageHeader("Welcome", breadcrumbs, "home", "", null);
    if($routeParams.badlogin){
        $rootScope.pageHeader.error = "Bad Username or Password.";
    }
}
