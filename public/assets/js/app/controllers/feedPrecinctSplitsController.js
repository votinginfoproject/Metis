'use strict';
/*
 * Feeds PrecinctSplits Controller
 *
 */
function FeedPrecinctSplitsCtrl($scope, $rootScope, $feedsService, $routeParams, $location, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  // get the locality param from the route
  var localityid = $routeParams.locality;

  // get the precinct param from the route
  var precinctid = $routeParams.precinct;

  // initialize page header variables
  $rootScope.setPageHeader("Precinct Splits", $rootScope.getBreadCrumbs(), "feeds", "", null);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // now call the other services to get the rest of the data
      FeedPrecinctSplitCtrl_getFeedPrecinctSplits($scope, $rootScope, $feedsService, $rootScope.getServiceUrl($location.path()), $filter, ngTableParams, feedid, localityid, precinctid);

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
      $scope.feedPrecinctSplits = {};
    });
}

/*
 * Get the Feed PrecinctSplit for the Feed detail page
 *
 */
function FeedPrecinctSplitCtrl_getFeedPrecinctSplits($scope, $rootScope, $feedsService, servicePath, $filter, ngTableParams, feedid, localityid, precinctid){

  // get Feed Precinct Split
  $feedsService.getFeedPrecinctSplits(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedPrecinctSplits = data;

      $scope.precinctsplitsTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, 15, { id: 'asc' });

    }).error(function (data, $http) {

      if($http===404){
        // feed not found

        $rootScope.pageHeader.alert = "Sorry, Precinct Splits  for Precinct  \"" + precinctid + "\" of Locality  \"" + localityid + "\" under VIP feed \"" + feedid + "\" does not exist.";
      } else {
        // some other error

        $rootScope.pageHeader.error += "Could not retrieve Feed Precinct Splits data. ";
      }

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedPrecinctSplits = {};
    });
}