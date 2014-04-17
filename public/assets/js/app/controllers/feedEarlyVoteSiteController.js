'use strict';
/*
 * Feed Early Vote Site Controller
 *
 */
function FeedEarlyVoteSiteCtrl($scope, $rootScope, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  // create a unique id for this page based on the breadcrumbs
  $scope.pageId = $rootScope.generatePageId(feedid) + "-single";

  // get the electoral district param from the route
  var earlyvotesiteid = $routeParams.earlyvotesiteid;

  // initialize page header variables
  $rootScope.setPageHeader("Early Vote Site", $rootScope.getBreadCrumbs(), "feeds", "", null);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // now call the other services to get the rest of the data
      FeedEarlyVoteSiteCtrl_getFeedEarlyVoteSite($scope, $rootScope, $feedsService, $rootScope.getServiceUrl($location.path()), $appProperties, $filter, ngTableParams, feedid, earlyvotesiteid);

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
      $scope.feedEarlyVoteSite = {};
    });
}

/*
 * Get the Feed Early Vote Site for the Feed detail page
 *
 */
function FeedEarlyVoteSiteCtrl_getFeedEarlyVoteSite($scope, $rootScope, $feedsService, servicePath, $appProperties, $filter, ngTableParams, feedid, earlyvotesiteid){

  // get Feed Early Vote Site
  $feedsService.getFeedEarlyVoteSite(servicePath)
    .success(function (data) {

        // set the feeds data into the Angular model
      $scope.feedEarlyVoteSite = data;

      // set the title
      $rootScope.pageHeader.title = "Early Vote Site ID: " + data.id;

    }).error(function (data, $http) {

      if($http===404){
        // feed not found

        $rootScope.pageHeader.alert = "Sorry, Early Vote Site \"" + earlyvotesiteid + "\" could not be found.";
      } else {
        // some other error

        $rootScope.pageHeader.error += "Could not retrieve Feed Early Vote Site data. ";
      }

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedEarlyVoteSite = {};
    });
}