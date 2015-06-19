'use strict';
/*
 * Feeds Controller
 *
 */
function FeedsCtrl($scope, $rootScope, $feedDataPaths, $feedsService, $location, $filter, ngTableParams, $interval, $timeout, $route) {

  // initialize page header variables
  $rootScope.setPageHeader("Feeds", $rootScope.getBreadCrumbs(), "feeds", null);

  $feedDataPaths.getResponse({ path: "/db/feeds",
                               scope: $rootScope,
                               key: "feeds",
                               errorMessage: "Could not retrieve Feeds."});
}
