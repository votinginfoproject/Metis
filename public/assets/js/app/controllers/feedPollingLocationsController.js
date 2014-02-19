'use strict';
/*
 * Feed Polling Locations Controller
 *
 */
function FeedPollingLocationsCtrl($scope, $rootScope, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  // create a unique id for this page based on the breadcrumbs
  $scope.pageId = $rootScope.generatePageId(feedid);

  // initialize page header variables
  $rootScope.setPageHeader("Polling Locations", $rootScope.getBreadCrumbs(), "feeds", "", null);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // now call the other services to get the rest of the data
      FeedPollingLocationsCtrl_getPollingLocations($scope, $rootScope, $feedsService, $rootScope.getServiceUrl($location.path()), $appProperties, $filter, ngTableParams, feedid);

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
      $scope.feedPollingLocations = {};
    });
}

/*
 * Get the Polling Locations for the Feed detail page
 *
 */
function FeedPollingLocationsCtrl_getPollingLocations($scope, $rootScope, $feedsService, servicePath, $appProperties, $filter, ngTableParams, feedid){

  // get Feed Polling Locations
  $feedsService.getFeedPollingLocations(servicePath)
    .success(function (data) {

      // use the self property to use as the linked URL for each item
      $rootScope.changeSelfToAngularPath(data);

      // set the feeds data into the Angular model
      $scope.feedPollingLocations = data;

      $scope.pollingLocationsTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, $appProperties.lowPagination, { id: 'asc' });


    }).error(function (data, $http) {

      $rootScope.pageHeader.error += "Could not retrieve Polling Locations data. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedPollingLocations = {};
    });
}