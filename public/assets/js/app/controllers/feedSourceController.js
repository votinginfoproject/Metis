'use strict';
/*
 * Feeds Source Controller
 *
 */
function FeedSourceCtrl($scope, $rootScope, $feedsService, $routeParams, $location) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = $routeParams.vipfeed;

  var breadcrumbs = [
    {
      name: "Feeds",
      url: "/#/feeds"
    },
    {
      name: feedid,
      url: "/#/feeds/" + $scope.vipfeed
    },
    {
      name: "Source",
      url: $location.absUrl()
    }
  ];

  // initialize page header variables
  $rootScope.setPageHeader("", breadcrumbs, "feeds", null);
  $rootScope.pageHeader.error = "";

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedData = data;

      // now call the other services to get the rest of the data
      FeedSourceCtrl_getFeedSource($scope, $rootScope, $feedsService, data.source);

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed data. ";
    });
}

/*
 * Get the Feed Source for the Feed detail page
 *
 */
function FeedSourceCtrl_getFeedSource($scope, $rootScope, $feedsService, servicePath){

  // get Feed Source
  $feedsService.getFeedSource(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedSource = data;

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed Source. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedSource = {};
    });
}
