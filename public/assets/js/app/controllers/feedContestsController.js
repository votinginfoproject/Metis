'use strict';
/**
 * Created by rcartier13 on 1/17/14.
 */

function FeedContestsCtrl($scope, $rootScope, $feedsService, $routeParams, $location, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  // initialize page header variables
  $rootScope.setPageHeader("Contests", $rootScope.getBreadCrumbs(), "feeds", "", null);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // now call the other services to get the rest of the data
      FeedContestsCtrl_getFeedElection($scope, $rootScope, $feedsService, data.election, $filter, ngTableParams);

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
      $scope.feedContests = {};
    });
}

/*
 * Get the Feed Election for the Feed detail page
 *
 */
function FeedContestsCtrl_getFeedElection($scope, $rootScope, $feedsService, servicePath, $filter, ngTableParams){

  // get Feed Election
  $feedsService.getFeedElection(servicePath)
    .success(function (data) {
      // now call the other services to get the rest of the data
      FeedContestsCtrl_getFeedContests($scope, $rootScope, $feedsService, data.contests, $filter, ngTableParams);

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed Election Contests. ";
      $scope.feedContests = {};
    });
}

function FeedContestsCtrl_getFeedContests($scope, $rootScope, $feedsService, servicePath, $filter, ngTableParams) {

  $feedsService.getFeedContests(servicePath)
    .success(function(data) {

      // set the feeds data into the Angular model
      $scope.feedContests = data;

      // sets the defaults for the table sorting parameters
      $scope.contestsTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, 25, { id: 'asc' });

      // set the title
      $rootScope.pageHeader.title = $scope.feedContests.length + " Contests";
    }).error(function(data, $http) {
      $rootScope.pageHeader.error += "Could not retrieve Feed Contests data. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedContests = {};
    });
}