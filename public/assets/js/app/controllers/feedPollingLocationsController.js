'use strict';
/*
 * Feed Polling Locations Controller
 *
 */
function FeedPollingLocationsCtrl($scope, $rootScope, $feedDataPaths, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {
  var feedid = $scope.vipfeed = $routeParams.vipfeed;
  var precinctid = $routeParams.precinct;

  $feedDataPaths.getResponse({ path: '/db/v3/feeds/' + feedid + '/precinct/' + precinctid + '/polling-locations',
                               scope: $rootScope,
                               key: 'feedPollingLocations',
                               errorMessage: 'Could not retrieve Feed Polling Locations.'},
                             function(result) { $scope.pollingLocationsTable = $rootScope.createTableParams(ngTableParams, $filter, result, $appProperties.highPagination, { id: 'asc' }); });

  $rootScope.setPageHeader("Polling locations", $rootScope.getBreadCrumbs(), "feeds", "", null);
}
