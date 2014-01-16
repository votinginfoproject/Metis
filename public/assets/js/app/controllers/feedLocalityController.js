'use strict';
/*
 * Feeds Locality Controller
 *
 */
function FeedLocalityCtrl($scope, $rootScope, $feedsService, $routeParams, $location, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  // get the locality param from the route
  var localityid = $routeParams.locality;

  // initialize page header variables
  $rootScope.setPageHeader("Locality", $rootScope.getBreadCrumbs(), "feeds", "", null);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // now call the other services to get the rest of the data
      FeedLocalityCtrl_getFeedLocality($scope, $rootScope, $feedsService, $rootScope.getServiceUrl($location.path()), $filter, ngTableParams, feedid, localityid);

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
      $scope.feedLocality = {};
      $scope.feedEarlyVoteSites = {};
      $scope.feedPrecincts = {};
    });
}

/*
 * Get the Feed Locality for the Feed detail page
 *
 */
function FeedLocalityCtrl_getFeedLocality($scope, $rootScope, $feedsService, servicePath, $filter, ngTableParams, feedid, localityid){

  // get Feed Locality
  $feedsService.getFeedLocality(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedLocality = data;

      // set the title
      $rootScope.pageHeader.title = "Locality ID: " + data.id;

      // now call the other services to get the rest of the data
      FeedLocalityCtrl_getFeedEarlyVoteSites($scope, $rootScope, $feedsService, data.earlyvotesites, $filter, ngTableParams);
      FeedLocalityCtrl_getFeedPrecincts($scope, $rootScope, $feedsService, data.precincts, $filter, ngTableParams);


    }).error(function (data, $http) {

      if($http===404){
        // feed not found

        $rootScope.pageHeader.alert = "Sorry, Locality  \"" + localityid + "\" for VIP feed \"" + feedid + "\" does not exist.";
      } else {
        // some other error

        $rootScope.pageHeader.error += "Could not retrieve Feed Locality data. ";
      }

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedLocality = {};
      $scope.feedEarlyVoteSites = {};
      $scope.feedPrecincts = {};
    });
}

/*
 * Get the Feed Locality Early Vote Sites for the Feed detail page
 *
 */
function FeedLocalityCtrl_getFeedEarlyVoteSites($scope, $rootScope, $feedsService, servicePath, $filter, ngTableParams){

  // get Feed Early Vote Sites
  $feedsService.getFeedLocalityEarlyVoteSites(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedEarlyVoteSites = data;

      $scope.earlyVoteTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, 15, { id: 'asc' });

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Locality Early Vote Sites. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedEarlyVoteSites = {};
    });
}

/*
 * Get the Feed Locality Precincts for the Feed detail page
 *
 */
function FeedLocalityCtrl_getFeedPrecincts($scope, $rootScope, $feedsService, servicePath, $filter, ngTableParams){

  // get Feed Precincts
  $feedsService.getFeedLocalityPrecincts(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedPrecincts = data;

      $scope.precinctsTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, 15, { id: 'asc' });

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Locality Precincts. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedPrecincts = {};
    });
}