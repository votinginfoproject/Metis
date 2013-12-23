'use strict';
/*
 * Feeds State Controller
 *
 */
function FeedStateCtrl($scope, $rootScope, $feedsService, $routeParams, $location) {

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
      FeedStateCtrl_getFeedState($scope, $rootScope, $feedsService, data.state);

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
    });
}

/*
 * Get the Feed State for the Feed detail page
 *
 */
function FeedStateCtrl_getFeedState($scope, $rootScope, $feedsService, servicePath){

  // get Feed State
  $feedsService.getFeedState(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedState = data;

      // set the title
      $rootScope.pageHeader.title = "State ID: " + data.id;

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed State data. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedState = {};
    });
}
