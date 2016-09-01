'use strict';

// TODO: Need to check these pages, since they rely on some kind of
// mapping from $location.path() to '/db' routes

function FeedErrorsCtrl($scope, $rootScope, $feedsService, $feedDataPaths, $route, $routeParams, $location, $filter, ngTableParams) {
  // initialize page header variables
  $rootScope.setPageHeader("Errors", $rootScope.getBreadCrumbs(), "feeds", "", null);

  $rootScope.errorReportPath = "/db" + $location.path() + "/report";

  // clear previous errors (so they don't weirdly show up on the page)
  $rootScope.errors = null;

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  // create a unique id for this page based on the breadcrumbs
  $scope.pageId = $rootScope.generatePageId(feedid);

  // Toggle showing/hiding each error's detail panel
  $scope._toggleError = function (prefix, index) {
    var obj = jQuery("#" + prefix + "ErrorDetail" + index);
    var arrowClosed = jQuery("#" + prefix + "ErrorArrowClosed" + index);
    var arrowOpen = jQuery("#" + prefix + "ErrorArrowOpen" + index);

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

  $feedDataPaths.getResponse({ path: '/db' + $location.path(),
                               scope:  $rootScope,
                               key: 'errors',
                               errorMessage: 'Cound not retrieve errors' },
                             function(results) {
                               $rootScope.total_errors = 0;
                               $.each(results, function() {
                                 $rootScope.total_errors += parseInt(this.count);
                               });
                               $scope.fatalErrors = results.filter(function(row) {
                                 return row.severity === 'fatal' || row.severity === 'critical';
                               });
                               $scope.minorErrors = results.filter(function(row) {
                                 return row.severity === 'warnings' || row.severity === 'errors';
                               });
                             });
}
