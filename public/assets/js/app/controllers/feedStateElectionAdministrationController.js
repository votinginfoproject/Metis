'use strict';
/*
 * Feeds State Election Administration Controller
 *
 */
function FeedStateElectionAdministrationCtrl($scope, $rootScope, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  // initialize page header variables
  $rootScope.setPageHeader("Election Administration", $rootScope.getBreadCrumbs(), "feeds", "", null);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // now call the other services to get the rest of the data
      FeedStateCtrl_getFeedSElectionAdministration($scope, $rootScope, $feedsService, $rootScope.getServiceUrl($location.path()), $appProperties, $filter, ngTableParams);

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
      $scope.feedElectionAdministration = {};
    });
}

/*
 * Get the Feed State Election Administration for the Feed detail page
 *
 */
function FeedStateCtrl_getFeedSElectionAdministration($scope, $rootScope, $feedsService, servicePath, $appProperties, $filter, ngTableParams){

  // get Feed State
  $feedsService.getFeedStateElectionAdministration(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedElectionAdministration = data;

      // update the title
      $rootScope.pageHeader.title = "Election Administration ID: " + data.id;

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed State Election Administration data. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedElectionAdministration = {};
    });
}