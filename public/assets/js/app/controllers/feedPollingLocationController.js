'use strict';
/*
 * Feed Polling Location Controller
 *
 */
function FeedPollingLocationCtrl($scope, $rootScope, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  // create a unique id for this page based on the breadcrumbs
  $scope.pageId = $rootScope.generatePageId(feedid) + "-single";

  // get the polling locations param from the route
  var pollinglocationid = $routeParams.pollinglocationid;

  // initialize page header variables
  $rootScope.setPageHeader("Polling Location", $rootScope.getBreadCrumbs(), "feeds", "", null);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // now call the other services to get the rest of the data
      FeedPollingLocationCtrl_getPollingLocation($scope, $rootScope, $feedsService, $rootScope.getServiceUrl($location.path()), $appProperties, $filter, ngTableParams, feedid, pollinglocationid);

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
      $scope.feedPollingLocation = {};
    });
}

/*
 * Get the Polling Location for the Feed detail page
 *
 */
function FeedPollingLocationCtrl_getPollingLocation($scope, $rootScope, $feedsService, servicePath, $appProperties, $filter, ngTableParams, feedid, pollinglocationid){

  // get Feed Polling Location
  $feedsService.getFeedPollingLocation(servicePath)
    .success(function (data) {

      // use the self property to use as the linked URL for each item
      $rootScope.changeSelfToAngularPath(data.precincts);
      $rootScope.changeSelfToAngularPath(data.precinct_splits);

        // set the feeds data into the Angular model
      $scope.feedPollingLocation = data;

      $scope.precinctsTableParams = $rootScope.createTableParams(ngTableParams, $filter, data.precincts, $appProperties.lowPagination, { id: 'asc' });
      $scope.precinctsplitsTableParams = $rootScope.createTableParams(ngTableParams, $filter, data.precinct_splits, $appProperties.lowPagination, { id: 'asc' });

      // set the title
      $rootScope.pageHeader.title = "Polling Location ID: " + data.id;

    }).error(function (data, $http) {

      if($http===404){
        // feed not found

        $rootScope.pageHeader.alert = "Sorry, Polling Location \"" + pollinglocationid + "\" could not be found.";
      } else {
        // some other error

        $rootScope.pageHeader.error += "Could not retrieve Polling Location data. ";
      }

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedPollingLocation = {};
    });
}