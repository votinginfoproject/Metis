'use strict';
/*
 * Feeds State Controller
 *
 */
function FeedStateCtrl($scope, $rootScope, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  // initialize page header variables
  $rootScope.setPageHeader("State", $rootScope.getBreadCrumbs(), "feeds", "", null);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // now call the other services to get the rest of the data
      FeedStateCtrl_getFeedState($scope, $rootScope, $feedsService, data.state, $appProperties, $filter, ngTableParams);
      FeedStateCtrl_getFeedElection($scope, $rootScope, $feedsService, data.election, $appProperties, $filter, ngTableParams);
      FeedStateCtrl_getFeedPollingLocations($scope, $rootScope, $feedsService, data.polling_locations);

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
      $scope.feedElection = {};
      $scope.feedPollingLocations = {};
      $scope.feedLocalities = {};
    });
}

/*
 * Get the Feed State for the Feed detail page
 *
 */
function FeedStateCtrl_getFeedState($scope, $rootScope, $feedsService, servicePath, $appProperties, $filter, ngTableParams){

  // get Feed State
  $feedsService.getFeedState(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedState = data;

      // set the title
      $rootScope.pageHeader.title = "Polling Locations";

      FeedStateCtrl_getFeedLocalities($scope, $rootScope, $feedsService, data.localities, $appProperties, $filter, ngTableParams);

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed State data. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedLocalities = {};
    });
}

/*
 * Get the Feed Election for the Feed detail page
 *
 */
function FeedStateCtrl_getFeedElection($scope, $rootScope, $feedsService, servicePath, $appProperties, $filter, ngTableParams){

  // get Feed Election
  $feedsService.getFeedElection(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedElection = data;

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed Election Elections. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedElection = {};
    });
}

/*
 * Get the Feed Polling Locations for the Feed Overview page
 *
 */
function FeedStateCtrl_getFeedPollingLocations($scope, $rootScope, $feedsService, servicePath){

  // get Polling Locations
  $feedsService.getFeedPollingLocations(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedPollingLocations = data;

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed Polling Locations. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedPollingLocations = {};
    });
}

/*
 * Get the Feed State Localities for the Feed detail page
 *
 */
function FeedStateCtrl_getFeedLocalities($scope, $rootScope, $feedsService, servicePath, $appProperties, $filter, ngTableParams){

  // get Feed Localities
  $feedsService.getFeedStateLocalities(servicePath)
    .success(function (data) {

      // use the self property to use as the linked URL for each item
      $rootScope.changeSelfToAngularPath(data);

      // set the feeds data into the Angular model
      $scope.feedLocalities = data;

      $scope.localTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, $appProperties.lowPagination, { id: 'asc' });

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve State Localities. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedLocalities = {};
    });
}
