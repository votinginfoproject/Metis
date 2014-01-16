'use strict';
/*
 * Feeds Overview Controller
 *
 */
function FeedOverviewCtrl($scope, $rootScope, $feedsService, $routeParams, $location) {

  // TODO
  // clear the feedData from the cache
  //$rootScope.cache.remove("feedData");

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  // initialize page header variables
  $rootScope.setPageHeader("", $rootScope.getBreadCrumbs(), "feeds", "", null);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data, $http) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // TODO
      // set the feed data variable into the cache
      //$rootScope.cache.put("feedData", data);

      // set the title
      $rootScope.pageHeader.title = data.title;

      // now call the other services to get the rest of the data

      FeedOverviewCtrl_getFeedPollingLocations($scope, $rootScope, $feedsService, data.polling_locations);
      FeedOverviewCtrl_getFeedContests($scope, $rootScope, $feedsService, data.contests);
      FeedOverviewCtrl_getFeedResults($scope, $rootScope, $feedsService, data.results);
      FeedOverviewCtrl_getFeedLocalities($scope, $rootScope, $feedsService, data.localities);

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
      $scope.feedPollingLocations = {};
      $scope.feedContests = {};
      $scope.feedResults = {};
      $scope.feedLocalities = {};
    });
}

/*
 * Get the Feed Polling Locations for the Feed Overview page
 *
 */
function FeedOverviewCtrl_getFeedPollingLocations($scope, $rootScope, $feedsService, servicePath){

  // get Polling Locations
  $feedsService.getFeedPollingLocations(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedPollingLocations = data;

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed Polling Locations. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedPollingLocations = {};
    });
}

/*
 * Get the Feed Contests for the Feed Overview page
 *
 */
function FeedOverviewCtrl_getFeedContests($scope, $rootScope, $feedsService, servicePath){

  // get Contests
  $feedsService.getFeedContests(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedContests = data;

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed Contests. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedContests = {};
    });
}

/*
 * Get the Feed Results for the Feed Overview page
 *
 */
function FeedOverviewCtrl_getFeedResults($scope, $rootScope, $feedsService, servicePath){

  // get Results
  $feedsService.getFeedResults(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedResults = data;

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed Results. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedResults = {};
    });
}

/*
 * Get the Feed Localities for the Feed Overview page
 *
 */
function FeedOverviewCtrl_getFeedLocalities($scope, $rootScope, $feedsService, servicePath){

  // get Results
  $feedsService.getFeedLocalities(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedLocalities = data;

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed Localities. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedLocalities = {};
    });
}