'use strict';

// TODO: Need to check these pages, since they rely on some kind of
// mapping from $location.path() to '/db' routes

function FeedErrorsCtrl($scope, $rootScope, $feedsService, $feedDataPaths, $errorsService, $route, $routeParams, $location, $filter, ngTableParams) {
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

  $scope.toggleError = $errorsService.toggleError;

  $feedDataPaths.getResponse({ path: '/db' + $location.path(),
                               scope:  $rootScope,
                               key: 'errors',
                               errorMessage: 'Could not retrieve errors' },
                             function(results) {
                               $rootScope.total_errors = 0;
                               $.each(results, function() {
                                 $rootScope.total_errors += parseInt(this.count);
                               });
                               $errorsService.splitErrors($scope, results);
                             });
}
