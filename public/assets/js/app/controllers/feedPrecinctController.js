'use strict';
/*
 * Feeds Precinct Controller
 *
 */
function FeedPrecinctCtrl($scope, $rootScope, $feedDataPaths, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {

  var feedid = $scope.vipfeed = $routeParams.vipfeed;
  var localityid = $routeParams.locality;
  var precinctid = $routeParams.precinct;

  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/precinct/' + precinctid,
                               scope: $rootScope,
                               key: 'feedPrecinct',
                               errorMessage: 'Could not retrieve Precinct Data.'},
                             function(result) { $rootScope.feedPrecinct = result[0]; });

  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/precinct/' + precinctid + '/early-vote-sites',
                               scope: $rootScope,
                               key: 'feedEarlyVoteSites',
                               errorMessage: 'Could not retrieve Early Vote Sites Data.'},
                             function(result) { $scope.electoralDistrictsParams = $rootScope.createTableParams(ngTableParams, $filter, result, $appProperties.lowPagination, { id: 'asc' }); });
  
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/precinct/' + precinctid + '/electoral-districts',
                               scope: $rootScope,
                               key: 'feedElectoralDistricts',
                               errorMessage: 'Could not retrieve Electoral Districts Data.'},
                             function(result) { $scope.earlyVoteTableParams = $rootScope.createTableParams(ngTableParams, $filter, result, $appProperties.lowPagination, { id: 'asc' }); });

  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/precinct/' + precinctid + '/polling-locations',
                               scope: $rootScope,
                               key: 'feedPollingLocations',
                               errorMessage: 'Could not retrieve Polling Locations Data.'},
                             function(result) { $scope.pollingLocationsParams = $rootScope.createTableParams(ngTableParams, $filter, result, $appProperties.lowPagination, { id: 'asc' }); });

  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/precinct/' + precinctid + '/precinct-splits',
                               scope: $rootScope,
                               key: 'feedPrecinctSplits',
                               errorMessage: 'Could not retrieve Precinct Splits Data.'},
                             function(result) { $scope.precinctSplitsTableParams = $rootScope.createTableParams(ngTableParams, $filter, result, $appProperties.lowPagination, { id: 'asc' }); });

  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/precinct/' + precinctid + '/street-segments',
                               scope: $rootScope,
                               key: 'feedStreetSegments',
                               errorMessage: 'Could not retrieve Street Segment Error Count Data.'},
                             function(result) { $rootScope.feedStreetSegments = result[0]; });

  // initialize page header variables
  $rootScope.setPageHeader("Precinct", $rootScope.getBreadCrumbs(), "feeds", "", null);
}