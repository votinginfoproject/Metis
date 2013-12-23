'use strict';
/*
 * Styleguide Controller
 *
 */
function StyleguideCtrl($scope, $rootScope, $location) {

  var breadcrumbs = null;

  // initialize page header variables
  $rootScope.setPageHeader("Styleguide", breadcrumbs, "styleguide", null, null);
}
