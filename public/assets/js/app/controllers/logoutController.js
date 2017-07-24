'use strict';
/*
 * Logout Controller
 *
 */
function LogoutCtrl($scope, $rootScope, $authService) {

  $authService.logout();
  var breadcrumbs = null;
  // initialize page header variables
  $rootScope.setPageHeader("Logged Out", breadcrumbs, "", "", null);
}
