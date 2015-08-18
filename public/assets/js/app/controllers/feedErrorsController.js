'use strict';

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

  $feedDataPaths.getResponse({ path: '/db' + $location.path(),
                               scope:  $rootScope,
                               key: 'errors',
                               errorMessage: 'Cound not retrieve errors' },
                             function(result) { 
                              $rootScope.total_errors = 0;
                              $.each(result, function() {
                                $rootScope.total_errors += parseInt(this.count);
                              });
                             });
}
