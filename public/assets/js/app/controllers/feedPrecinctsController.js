'use strict';
/*
 * Feeds Precinct Controller
 *
 */
function FeedPrecinctsCtrl($scope, $rootScope, $feedsService, $routeParams, $location, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  // get the locality param from the route
  var localityid = $routeParams.locality;

  // initialize page header variables
  $rootScope.setPageHeader("Precincts", $rootScope.getBreadCrumbs(), "feeds", "", null);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // now call the other services to get the rest of the data
      FeedPrecinctsCtrl_getFeedPrecincts($scope, $rootScope, $feedsService, $rootScope.getServiceUrl($location.path()), $filter, ngTableParams, feedid, localityid);

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
      $scope.feedPrecincts = {};
    });

}

/*
 * Get the Feed Locality Precincts for the Feed detail page
 *
 */
function FeedPrecinctsCtrl_getFeedPrecincts($scope, $rootScope, $feedsService, servicePath, $filter, ngTableParams, feedid, localityid){

  // get Feed Precincts
  $feedsService.getFeedPrecincts(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedPrecincts = data;

      $scope.precinctsTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, 15, { id: 'asc' });

    }).error(function (data, $http) {

      if($http===404){
        // feed not found

        $rootScope.pageHeader.alert = "Sorry, Precincts for Locality  \"" + localityid + "\" under VIP feed \"" + feedid + "\" does not exist.";
      } else {
        // some other error

        $rootScope.pageHeader.error += "Could not retrieve Feed Precincts data. ";
      }

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedPrecincts = {};
    });
}