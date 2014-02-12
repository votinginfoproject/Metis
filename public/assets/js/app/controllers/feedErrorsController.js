'use strict';
/*
 * Feeds Errors Controller
 *
 */
function FeedErrorsCtrl($scope, $rootScope, $feedsService, $routeParams, $location, $filter, ngTableParams) {

  // initialize page header variables
  $rootScope.setPageHeader("Errors", $rootScope.getBreadCrumbs(), "feeds", "", null);

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  // create a unique id for this page based on the breadcrumbs
  $scope.pageId = $rootScope.generatePageId(feedid);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // Toggle showing/hiding each error's detail panel
      $scope._toggleError = function (index) {

        var obj = jQuery("#errorDetail" + index);
        var arrowClosed = jQuery("#errorArrowClosed" + index);
        var arrowOpen = jQuery("#errorArrowOpen" + index);

        if (obj.is(":visible")) {
          obj.hide();
          arrowClosed.show();
          arrowOpen.hide();
        } else {
          obj.show();
          arrowClosed.hide();
          arrowOpen.show();
        }
      }
      $scope.toggleError = $scope._toggleError;

      // now call the other services to get the rest of the data
      FeedErrorsCtrl_getFeedErrors($scope, $rootScope, $feedsService, $rootScope.getServiceUrl($location.path()), $filter, ngTableParams);

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
 * Get the Errors for the Feed detail page
 *
 */
function FeedErrorsCtrl_getFeedErrors($scope, $rootScope, $feedsService, servicePath, $filter, ngTableParams) {

  // get Feed Errors
  $feedsService.getFeedErrors(servicePath)
    .success(function (data) {

      // indent XML data
      vipApp_ns.findAndIndent(data);

      // set the feeds data into the Angular model
      $scope.errors = data;

      $scope.errorsTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, 15, { id: 'asc' });

      // count total errors
      var total_errors = vipApp_ns.countAllErrors(data);

      // update the title
      $rootScope.pageHeader.title = total_errors + " Total " + $rootScope.pageHeader.title;

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Errors data. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.errors = {};
    });
}