'use strict';
/*
 * Home Controller
 *
 */
function HomeCtrl($scope, $rootScope, $homeService, $location, $routeParams, $authService) {

  //if we end up here and we're authenticated, move on to the /feeds page
  if($authService.isAuthenticated()) {
    $location.url("/feeds");
  }

  var breadcrumbs = null;
  // initialize page header variables
  $rootScope.setPageHeader("Welcome", breadcrumbs, "home", "", null);
  $scope.login = function() {
  	$authService.login();
  };
}
