'use strict';
/*
 * Feeds Election Controller
 *
 */
function FeedElectionCtrl($scope, $rootScope, $feedsService, $routeParams, $location, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  // initialize page header variables
  $rootScope.setPageHeader("Election", $rootScope.getBreadCrumbs(), "feeds", "", null);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // now call the other services to get the rest of the data
      FeedElectionCtrl_getFeedElection($scope, $rootScope, $feedsService, data.election, $filter, ngTableParams);

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
      $scope.feedElection = {};
      $scope.feedContests = {};
    });
}

/*
 * Get the Feed Election for the Feed detail page
 *
 */
function FeedElectionCtrl_getFeedElection($scope, $rootScope, $feedsService, servicePath, $filter, ngTableParams){

  // get Feed Election
  $feedsService.getFeedElection(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedElection = data;

      // set the title
      $rootScope.pageHeader.title = "Election ID: " + data.id;

      // now call the other services to get the rest of the data
      FeedElectionCtrl_getFeedContests($scope, $rootScope, $feedsService, data.contests, $filter, ngTableParams);

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed Election Contests. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedElection = {};
      $scope.feedContests = {};
    });
}

/*
 * Get the Feed Election Contests for the Feed detail page
 *
 */
function FeedElectionCtrl_getFeedContests($scope, $rootScope, $feedsService, servicePath, $filter, ngTableParams){

  // get Feed Contests
  $feedsService.getFeedElectionContests(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedContests = data;
      // sets the defaults for the table sorting parameters
      $scope.tableParams = $rootScope.createTableParams(ngTableParams, $filter, data, 15, { id: 'asc' });

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed Election Contests. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedContests = {};
    });
}