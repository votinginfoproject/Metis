'use strict';
/*
 * Feed Electoral District Controller
 *
 */
function FeedElectoralDistrictCtrl($scope, $rootScope, $feedDataPaths, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $scope.vipfeed = $routeParams.vipfeed;
  var contestid = $routeParams.contest;

  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/contests/' + contestid + '/electoral-district',
                               scope:  $rootScope,
                               key: 'feedElectoralDistrict',
                               errorMessage: 'Cound not retrieve Electoral District Data.'},
                             function(result) { $rootScope.feedElectoralDistrict = result[0]; });

  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/contests/' + contestid,
                               scope:  $rootScope,
                               key: 'feedContests',
                               errorMessage: 'Cound not retrieve Contests.'});

  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/contests/' + contestid + '/electoral-district/precincts',
                               scope:  $rootScope,
                               key: 'feedPrecincts',
                               errorMessage: 'Cound not retrieve Precinct Data.'},
                             function(result) { $scope.precinctsTableParams = $rootScope.createTableParams(ngTableParams, $filter, result, $appProperties.highPagination, { id: 'asc' }); });

  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/contests/' + contestid + '/electoral-district/precinct-splits',
                               scope:  $rootScope,
                               key: 'feedPrecinctSplits',
                               errorMessage: 'Cound not retrieve Precinct Split Data.'},
                             function(result) { $scope.precinctSplitsTableParams = $rootScope.createTableParams(ngTableParams, $filter, result, $appProperties.highPagination, { id: 'asc' }); });

  // initialize page header variables
  $rootScope.setPageHeader("Electoral District", $rootScope.getBreadCrumbs(), "feeds", "", null);
}