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

/*
 * Get the Feed Queue
 *
 */
function FeedsCtrl_getFeedQueue($scope, $rootScope, $feedsService, servicePath, $filter, ngTableParams){

  // get Feed Queue
  $feedsService.getFeedQueue(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedQueue = data.feedQueue;

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve List of Queued Feeds. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedQueue = {};
    });
}
