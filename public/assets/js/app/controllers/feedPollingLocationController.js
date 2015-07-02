'use strict';
/*
 * Feed Polling Location Controller
 *
 */
function FeedPollingLocationCtrl($scope, $rootScope, $feedDataPaths, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {

  var feedid = $scope.vipfeed = $routeParams.vipfeed;
  var pollinglocationid = $routeParams.pollinglocation;

  var precinctid = $routeParams.precinct;
  var precinctsplitid = $routeParams.precinctsplit;

  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/polling-locations/' + pollinglocationid,
                               scope: $rootScope,
                               key: 'feedPollingLocation',
                               errorMessage: 'Could not retrieve Polling Location Data.'},
                             function(result) { $rootScope.feedPollingLocation = result[0]; });

  if (precinctid)
    $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/polling-locations/' + pollinglocationid + '/precincts',
                                 scope: $rootScope,
                                 key: 'feedPrecincts',
                                 errorMessage: 'Could not retrieve Polling Location Precincts Data.'},
                               function(result) { $scope.precinctsTableParams = $rootScope.createTableParams(ngTableParams, $filter, result, $appProperties.lowPagination, { id: 'asc' }); });

  if (precinctsplitid)
    $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/polling-locations/' + pollinglocationid + '/precinct-splits',
                                 scope: $rootScope,
                                 key: 'feedPrecinctSplits',
                                 errorMessage: 'Could not retrieve Polling Location Precinct Splits Data.'},
                               function(result) { $scope.precinctsplitsTableParams = $rootScope.createTableParams(ngTableParams, $filter, result, $appProperties.lowPagination, { id: 'asc' }); });

  // initialize page header variables
  $rootScope.setPageHeader("Polling Location", $rootScope.getBreadCrumbs(), "feeds", "", null);
}