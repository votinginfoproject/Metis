'use strict';

function FeedErrorsCtrl($scope, $rootScope, $feedsService, $feedDataPaths, $route, $routeParams, $location, $filter, ngTableParams) {
  // initialize page header variables
  $rootScope.setPageHeader("Errors", $rootScope.getBreadCrumbs(), "feeds", "", null);

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
                             function(results) {
                               for (var i = 0; i < results.length; i++) {
                                 $feedDataPaths.getResponse({ path: '/db' + $location.path() + '/' + results[i]['error_type'] + '/example',
                                                              scope: results[i],
                                                              key: 'example',
                                                              errorMessage: 'Could not retrieve error example'});
                               }
                             });
}
