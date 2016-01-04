'use strict';
/*
 * Feed Electoral District Controller
 *
 */
function FeedElectoralDistrictCtrl($scope, $rootScope, $feedDataPaths, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $scope.vipfeed = $routeParams.vipfeed;

  if ($routeParams['locality']) { $scope.localityid = $routeParams.locality; }
  if ($routeParams['precinct']) { $scope.precinctid = $routeParams.precinct; }

  if ($routeParams['contest']) {
    var rootPath = '/db/v3/feeds/' + feedid + '/contests/' + $routeParams.contest + '/electoral-district';

    $feedDataPaths.getResponse({ path: '/db/v3/feeds/' + feedid + '/contests/' + $routeParams['contest'],
                                 scope:  $rootScope,
                                 key: 'feedContest',
                                 errorMessage: 'Cound not retrieve Contests.'},
                             function(result) { $rootScope.feedContest = result[0]; });
  }

  if ($routeParams['electoraldistrict']) {
    var rootPath = '/db/v3/feeds/' + feedid + '/electoral-districts/' + $routeParams.electoraldistrict;

    $feedDataPaths.getResponse({ path: rootPath + '/contest',
                                 scope:  $rootScope,
                                 key: 'feedContest',
                                 errorMessage: 'Cound not retrieve Contests.'},
                             function(result) { $rootScope.feedContest = result[0]; });
  }

  $feedDataPaths.getResponse({ path: rootPath,
                               scope:  $rootScope,
                               key: 'feedElectoralDistrict',
                               errorMessage: 'Cound not retrieve Electoral District Data.'},
                             function(result) { $rootScope.feedElectoralDistrict = result[0]; });

  $feedDataPaths.getResponse({ path: rootPath + '/precincts',
                               scope:  $rootScope,
                               key: 'feedPrecincts',
                               errorMessage: 'Cound not retrieve Precinct Data.'},
                             function(result) { $scope.precinctsTable = $rootScope.createTableParams(ngTableParams, $filter, result, $appProperties.highPagination, { id: 'asc' }); });

  $feedDataPaths.getResponse({ path: rootPath + '/precinct-splits',
                               scope:  $rootScope,
                               key: 'feedPrecinctSplits',
                               errorMessage: 'Cound not retrieve Precinct Split Data.'},
                             function(result) { $scope.precinctSplitsTable = $rootScope.createTableParams(ngTableParams, $filter, result, $appProperties.highPagination, { id: 'asc' }); });

  // initialize page header variables
  $rootScope.setPageHeader("Electoral District", $rootScope.getBreadCrumbs(), "feeds", "", null);
}
