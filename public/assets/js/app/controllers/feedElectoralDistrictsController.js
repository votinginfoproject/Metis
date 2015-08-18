'use strict';

function FeedElectoralDistrictsCtrl($scope, $rootScope, $feedDataPaths, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {
  var feedid = $scope.vipfeed = $routeParams.vipfeed;
  var precinctid = $routeParams.precinct;

  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/precinct/' + precinctid + '/electoral-districts',
                               scope: $rootScope,
                               key: 'feedElectoralDistricts',
                               errorMessage: 'Could not retrieve Feed Electoral Districts.'},
                             function(result) { $scope.electoralDistrictsTable = $rootScope.createTableParams(ngTableParams, $filter, result, $appProperties.highPagination, { id: 'asc' }); });

  $rootScope.setPageHeader("Electoral Districts", $rootScope.getBreadCrumbs(), "feeds", "", null); 
}