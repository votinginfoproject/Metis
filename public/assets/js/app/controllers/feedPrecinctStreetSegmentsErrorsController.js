'use strict';
/*
 * Feeds Precinct Street Segment Errors Controller
 *
 */
function FeedPrecinctStreetsegmentsErrorsCtrl($scope, $rootScope, $feedsService, $routeParams, $location, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  // get the locality param from the route
  var localityid = $routeParams.locality;

  // get the precinct param from the route
  var precinctid = $routeParams.precinct;

  // initialize page header variables
  $rootScope.setPageHeader("Street Segments Errors", $rootScope.getBreadCrumbs(), "feeds", "", null);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // Toggle showing/hiding each error's detail panel
      $scope._toggleError = function (index) {

        var obj = jQuery("#errorDetail" + index);

        if (obj.is(":visible")) {
          obj.hide();
        } else {
          obj.show();
        }

        /*
         // If toggling with Angular, however the indexes would be incorrect once any kind of sorting is applied to the table
         if($scope["error" + index]){
         $scope["error" + index] = false;
         } else {
         $scope["error" + index] = true;
         }
         */
      }
      $scope.toggleError = $scope._toggleError;

      // now call the other services to get the rest of the data
      FeedPrecinctCtrl_getFeedStreetSegmentsErrors($scope, $rootScope, $feedsService, $rootScope.getServiceUrl($location.path()), $filter, ngTableParams, feedid, localityid, precinctid);

    }).error(function (data, $http) {

      if ($http === 404) {
        // feed not found

        $rootScope.pageHeader.alert = "Sorry, the VIP feed \"" + feedid + "\" does not exist.";
      } else {
        // some other error

        $rootScope.pageHeader.error += "Could not retrieve Feed data. ";
      }

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedData = {};
      $scope.errors = {};
    });
}

/*
 * Get the Feed Precinct Street Segments Errors for the Feed detail page
 *
 */
function FeedPrecinctCtrl_getFeedStreetSegmentsErrors($scope, $rootScope, $feedsService, servicePath, $filter, ngTableParams, feedid, localityid, precinctid) {

  // get Feed Precinct
  $feedsService.getFeedPrecinctStreetSegmentsErrors(servicePath)
    .success(function (data) {

      // indent XML data
      vipApp_ns.findAndIndent(data);

      // set the feeds data into the Angular model
      $scope.errors = data;

      $scope.errorsTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, 15, { id: 'asc' });

      // update the title
      $rootScope.pageHeader.title = $scope.errors.length + " Total " + $rootScope.pageHeader.title;

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Errors data. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.errors = {};
    });
}