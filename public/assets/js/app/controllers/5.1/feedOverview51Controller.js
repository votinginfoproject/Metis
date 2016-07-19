'use strict';

function FeedOverview51Ctrl($scope, $rootScope, $feedDataPaths, $routeParams,
                            $location, $appProperties, $filter, ngTableParams) {
  var publicId = $rootScope.publicId = $routeParams.vipfeed;
  $rootScope.errorReport = "/db/feeds/" + publicId + "/xml/errors/report";

  $feedDataPaths
    .getResponse({path: '/db/feeds/' + publicId + '/xml/overview',
                  scope:  $rootScope,
                  key: 'overviewData',
                  errorMessage: 'Cound not retrieve Feed Overview Data.'},
                 function(result) {
                   var row = $rootScope.overviewData = result.shift();
                   $scope.pageTitle = row.election_date + " " +
                     row.election_type + " " +
                     row.state_name;
                   $rootScope.pageTitle = $scope.pageTitle;
                   $rootScope.setPageHeader($scope.pageTitle, [], 'feeds', null, null);
                 });

  $feedDataPaths
    .getResponse({path: 'db/feeds/' + publicId + '/xml/localityOverview',
                  scope: $rootScope,
                  key: 'pollingLocations',
                  errorMessage: 'Could not get locality data'},
                 function(result) {
                   var row = $rootScope.pollingLocationsData = result.shift();
                   $scope.pollingLocationsTable =
                     $rootScope.createTableParams(ngTableParams, $filter,
                                                  row.pollingLocations,
                                                  $appProperties.lowPagination,
                                                  { element_type: 'asc' });
                 });
}
