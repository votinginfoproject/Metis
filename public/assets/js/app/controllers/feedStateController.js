'use strict';
/*
 * Feeds State Controller
 *
 */
function FeedStateCtrl($scope, $rootScope, $feedsService, $routeParams, $location, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

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
      name: "Election",
      url: "/#/feeds/" + $scope.vipfeed + "/election"
    },
    {
      name: "State",
      url: $location.absUrl()
    }
  ];

  // initialize page header variables
  $rootScope.setPageHeader("State", breadcrumbs, "feeds", "", null);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // now call the other services to get the rest of the data
      FeedStateCtrl_getFeedState($scope, $rootScope, $feedsService, data.state, $filter, ngTableParams);

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
      $scope.feedState = {};
      $scope.feedEarlyVoteSites = {};
      $scope.feedLocalities = {};
    });
}

/*
 * Get the Feed State for the Feed detail page
 *
 */
function FeedStateCtrl_getFeedState($scope, $rootScope, $feedsService, servicePath, $filter, ngTableParams){

  // get Feed State
  $feedsService.getFeedState(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedState = data;

      // set the title
      $rootScope.pageHeader.title = "State ID: " + data.id;

      FeedStateCtrl_getFeedEarlyVoteSites($scope, $rootScope, $feedsService, data.earlyvotesites, $filter, ngTableParams);
      FeedStateCtrl_getFeedLocalities($scope, $rootScope, $feedsService, data.localities, $filter, ngTableParams);

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed State data. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedState = {};
      $scope.feedEarlyVoteSites = {};
      $scope.feedLocalities = {};
    });
}

/*
 * Get the Feed State Early Vote Sites for the Feed detail page
 *
 */
function FeedStateCtrl_getFeedEarlyVoteSites($scope, $rootScope, $feedsService, servicePath, $filter, ngTableParams){

  // get Feed Early Vote Sites
  $feedsService.getFeedStateEarlyVoteSites(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedEarlyVoteSites = data;

      $scope.earlyVoteTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, 10, { id: 'asc' });

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve State Early Vote Sites. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedEarlyVoteSites = {};
    });
}

/*
 * Get the Feed State Localities for the Feed detail page
 *
 */
function FeedStateCtrl_getFeedLocalities($scope, $rootScope, $feedsService, servicePath, $filter, ngTableParams){

  // get Feed Localities
  $feedsService.getFeedStateLocalities(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedLocalities = data;

      $scope.localTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, 10, { id: 'asc' });

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve State Localities. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedLocalities = {};
    });
}