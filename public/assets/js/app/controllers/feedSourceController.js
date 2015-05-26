'use strict';
/*
 * Feeds Source Controller
 *
 */
function FeedSourceCtrl($scope, $rootScope, $feedsService, $routeParams, $location) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = $routeParams.vipfeed;

  // initialize page header variables
  $rootScope.setPageHeader("Source", $rootScope.getBreadCrumbs(), "feeds", "" ,null);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // now call the other services to get the rest of the data
      FeedSourceCtrl_getFeedSource($scope, $rootScope, $feedsService, data.source);
      FeedSourceCtrl_getFeedElection($scope, $rootScope, $feedsService, data.election);

    }).error(function (data, $http) {

      if($http===404){
        // feed not found

        $rootScope.pageHeader.alert = "Sorry, the VIP feed \"" + feedid + "\" does not exist.";
      } else {
        // some other error

        $rootScope.pageHeader.error += "Could not retrieve Feed data. ";
      }

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedData = {};
      $scope.feedSource = {};
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

      // set the title
      $rootScope.pageHeader.title = "Source ID: " + data.id;

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed Source. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedSource = {};
    });
}

/*
 * Get the Feed Election for the Feed detail page
 *
 */
function FeedSourceCtrl_getFeedElection($scope, $rootScope, $feedsService, servicePath){

  // get Feed Election
  $feedsService.getFeedElection(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedElection = data;

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed Election. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedElection = {};
    });
}
