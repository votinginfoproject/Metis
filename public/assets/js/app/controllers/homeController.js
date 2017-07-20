'use strict';
/*
 * Home Controller
 *
 */
function HomeCtrl($scope, $rootScope, $homeService, $routeParams, $authService) {

  var breadcrumbs = null;
  // initialize page header variables
  $rootScope.setPageHeader("Welcome", breadcrumbs, "home", "", null);
  $scope.login = function() {
  	$authService.login();
  };
}
