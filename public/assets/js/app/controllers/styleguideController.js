'use strict';
/*
 * Styleguide Controller
 *
 */
function StyleguideCtrl($scope, $rootScope, $location) {

  var breadcrumbs = [
    {
      name: "Styleguide",
      url: $location.absUrl()
    }
  ];

  // initialize page header variables
  $rootScope.setPageHeader("Styleguide", breadcrumbs, "styleguide", null);
}
