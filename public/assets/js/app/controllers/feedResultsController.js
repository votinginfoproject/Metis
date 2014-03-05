'use strict';
/*
 * Feeds Results Controller
 *
 */
function FeedResultsCtrl($scope, $rootScope, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {

    // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  // initialize page header variables
  $rootScope.setPageHeader("Results", $rootScope.getBreadCrumbs(), "feeds", "", null);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data, $http) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // now call the other services to get the rest of the data
      FeedOverviewCtrl_getContestResults($scope, $rootScope, $feedsService, data.contest_results, $appProperties, $filter, ngTableParams);
      FeedOverviewCtrl_getBallotLineResults($scope, $rootScope, $feedsService, data.ballot_line_results, $appProperties, $filter, ngTableParams);

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
      $scope.feedContestResults = {};
      $scope.feedBallotLineResults = {};
    });
}

/*
 * Get the Feed Contest Results for the Feed Overview page
 *
 */
function FeedOverviewCtrl_getContestResults($scope, $rootScope, $feedsService, servicePath, $appProperties, $filter, ngTableParams){

  // get Contest Results
  $feedsService.getFeedContestResults(servicePath)
    .success(function (data) {

      $rootScope.changeSelfToAngularPath(data);

      // set the feeds data into the Angular model
      $scope.feedContestResults = data;

      $scope.contestResultsTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, $appProperties.lowPagination, { id: 'asc' });
    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed Contest Results. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedContestResults = {};
    });
}

/*
 * Get the Feed Ballot Line Results for the Feed Overview page
 *
 */
function FeedOverviewCtrl_getBallotLineResults($scope, $rootScope, $feedsService, servicePath, $appProperties, $filter, ngTableParams){

  // get Ballot Line Results
  $feedsService.getFeedBallotLineResults(servicePath)
    .success(function (data) {

      $rootScope.changeSelfToAngularPath(data);

      // set the feeds data into the Angular model
      $scope.feedBallotLineResults = data;

      $scope.ballotLineResultsTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, $appProperties.lowPagination, { id: 'asc' });
    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed Ballot Line Results. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedBallotLineResults = {};
    });
}