'use strict';
/*
 * Feeds Overview Controller
 *
 */
function FeedOverviewCtrl($scope, $rootScope, $feedDataPaths, $routeParams, $location, $appProperties, $filter, ngTableParams) {
  var feedid = $scope.vipfeed = $routeParams.vipfeed;

  var errorPath = $feedDataPaths.getFeedValidationsErrorCountPath(feedid);
  $feedDataPaths.getResponse({ path: errorPath,
                               scope: $rootScope,
                               key: "errorCount",
                               errorMessage: "Could not retrieve Feed Error Count."},
                             function(result) { $rootScope.errorCount = result[0].errorcount; });
  
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/overview',
                               scope:  $rootScope,
                               key: 'overviewData',
                               errorMessage: 'Cound not retrieve Feed Overview Data.'},
                             function(result) {
                              $rootScope.overviewData = result[0];
                              $scope.pollingLocationsTable = $rootScope.createTableParams(ngTableParams, $filter, result[0].pollingLocations, $appProperties.lowPagination, { element_type: 'asc' });
                              $scope.contestsTable = $rootScope.createTableParams(ngTableParams, $filter, result[0].contests, $appProperties.lowPagination, { element_type: 'asc' });
                             });
  
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/localities ',
                               scope:  $rootScope,
                               key: 'feedLocalities',
                               errorMessage: 'Cound not retrieve Feed Localities.'},
                             function(result) { $scope.localitiesTable = $rootScope.createTableParams(ngTableParams, $filter, result, $appProperties.lowPagination, { id: 'asc' }); });

  var breadcrumbs = $rootScope.getBreadCrumbs();
  $rootScope.setPageHeader(breadcrumbs[0]["name"], breadcrumbs, "feeds", "", null);
}
