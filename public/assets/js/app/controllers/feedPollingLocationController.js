'use strict';
/*
 * Feed Polling Location Controller
 *
 */
function FeedPollingLocationCtrl($scope, $rootScope, $feedDataPaths, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {

  var feedid = $scope.vipfeed = $routeParams.vipfeed;
  var pollinglocationid = $routeParams.pollinglocation;

  $scope.localityid = $routeParams.locality;
  $scope.precinctid = $routeParams.precinct;

  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/polling-locations/' + pollinglocationid,
                               scope: $rootScope,
                               key: 'feedPollingLocation',
                               errorMessage: 'Could not retrieve Polling Location Data.'},
                             function(result) { $rootScope.feedPollingLocation = result[0]; });

  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/polling-locations/' + pollinglocationid + '/precincts',
                               scope: $rootScope,
                               key: 'feedPrecincts',
                               errorMessage: 'Could not retrieve Polling Location Precincts Data.'},
                             function(result) { $scope.precinctsTable = $rootScope.createTableParams(ngTableParams, $filter, result, $appProperties.lowPagination, { id: 'asc' }); });

  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/polling-locations/' + pollinglocationid + '/precinct-splits',
                               scope: $rootScope,
                               key: 'feedPrecinctSplits',
                               errorMessage: 'Could not retrieve Polling Location Precinct Splits Data.'},
                             function(result) { $scope.precinctsplitsTableParams = $rootScope.createTableParams(ngTableParams, $filter, result, $appProperties.lowPagination, { id: 'asc' }); });

  $rootScope.setPageHeader("Polling Location", $rootScope.getBreadCrumbs(), "feeds", "", null);
}