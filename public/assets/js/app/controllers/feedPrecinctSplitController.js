'use strict';
/*
 * Feeds PrecinctSplit Controller
 *
 */
function FeedPrecinctSplitCtrl($scope, $rootScope, $feedDataPaths, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {

  var feedid = $scope.vipfeed = $routeParams.vipfeed;
  var precinctsplitid = $routeParams.precinctsplit;

  $feedDataPaths.getResponse({ path: '/db/v3/feeds/' + feedid + '/precinct-split/' + precinctsplitid,
                               scope: $rootScope,
                               key: 'feedPrecinctSplit',
                               errorMessage: 'Could not retrieve data for Precinct Split.'},
                             function(result) { $rootScope.feedPrecinctSplit = result[0]; });

  $feedDataPaths.getResponse({ path: '/db/v3/feeds/' + feedid + '/precinct-split/' + precinctsplitid + '/electoral-districts',
                               scope: $rootScope,
                               key: 'feedElectoralDistricts',
                               errorMessage: 'Could not retrieve data for Electoral Districts.'},
                             function(result) { $scope.electoralDistrictsTable = $rootScope.createTableParams(ngTableParams, $filter, result, $appProperties.lowPagination, { id: 'asc' }); });

  $feedDataPaths.getResponse({ path: '/db/v3/feeds/' + feedid + '/precinct-split/' + precinctsplitid + '/polling-locations',
                               scope: $rootScope,
                               key: 'feedPollingLocations',
                               errorMessage: 'Could not retrieve data for Polling Locations.'},
                             function(result) { $scope.pollingLocationsTable = $rootScope.createTableParams(ngTableParams, $filter, result, $appProperties.lowPagination, { id: 'asc' }); });

  $feedDataPaths.getResponse({ path: '/db/v3/feeds/' + feedid + '/precinct-split/' + precinctsplitid + '/street-segments',
                               scope: $rootScope,
                               key: 'feedStreetSegments',
                               errorMessage: 'Could not retrieve data for Street Segments.'},
                             function(result) { $rootScope.feedStreetSegments = result[0]; });

  // initialize page header variables
  $rootScope.setPageHeader("Precinct Split", $rootScope.getBreadCrumbs(), "feeds", "", null);
}
