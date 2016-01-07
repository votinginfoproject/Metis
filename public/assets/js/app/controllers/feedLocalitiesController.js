'use strict';

function FeedLocalitiesCtrl($scope, $rootScope, $feedDataPaths, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {
  var feedid = $scope.vipfeed = $routeParams.vipfeed;

  $feedDataPaths.getResponse({ path: '/db/v3/feeds/' + feedid + '/localities',
                               scope: $rootScope,
                               key: 'feedLocalities',
                               errorMessage: 'Could not retrieve Feed Localities.'},
                             function(result) { $scope.localitiesTable = $rootScope.createTableParams(ngTableParams, $filter, result, $appProperties.highPagination, { id: 'asc' }); });

  $rootScope.setPageHeader("Localities", $rootScope.getBreadCrumbs(), "feeds", "", null);
}
