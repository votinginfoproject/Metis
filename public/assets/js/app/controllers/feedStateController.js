'use strict';
/*
 * Feeds State Controller
 *
 */
function FeedStateCtrl($scope, $rootScope, $feedDataPaths, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {
  // get the vipfeed param from the route
  var feedid = $scope.vipfeed = $routeParams.vipfeed;

  $feedDataPaths.getResponse({ path: '/db/v3/feeds/' + feedid + '/election/state',
                               scope: $rootScope,
                               key: 'feedState',
                               errorMessage: 'Cound not retrieve Feed State Data.'},
                             function(result) { $rootScope.feedState = result[0]; });

  $feedDataPaths.getResponse({ path: '/db/v3/feeds/' + feedid + '/election/state/election-administration',
                               scope:  $rootScope,
                               key: 'feedElectionAdministration',
                               errorMessage: 'Cound not retrieve the Election Administration.'},
                             function(result) { $rootScope.feedElectionAdministration = result[0]; });

  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/overview',
                               scope: $rootScope,
                               key: 'overviewData',
                               errorMessage: 'Cound not retrieve Feed Overview Data.'},
                             function(result) {
                              $rootScope.overviewData = result[0];
                              $scope.pollingLocationsTable = $rootScope.createTableParams(ngTableParams, $filter, result[0].pollingLocations, $appProperties.lowPagination, { element_type: 'asc' });
                             });

  $feedDataPaths.getResponse({ path: '/db/v3/feeds/' + feedid + '/localities ',
                               scope:  $rootScope,
                               key: 'feedLocalities',
                               errorMessage: 'Cound not retrieve Feed Localities.'},
                             function(result) {
                              $scope.localitiesTable = $rootScope.createTableParams(ngTableParams, $filter, result, $appProperties.lowPagination, { element_type: 'asc' });
                             });

  // initialize page header variables
  $rootScope.setPageHeader("Polling Locations", $rootScope.getBreadCrumbs(), "feeds", "", null);
}
