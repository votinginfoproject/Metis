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
    .getResponse({path: 'db/feeds/' + $rootScope.publicId + '/xml/overview-summary',
                  scope: $scope,
                  key: 'summaries',
                  errorMessage: 'Could not get summary data'},
                 function (results) {
                   $scope.tableParams = {}
                   $scope.tableParams.pollingLocations =
                     $rootScope.createTableParams(
                       ngTableParams,
                       $filter,
                       results.pollingLocations,
                       $appProperties.lowPagination,
                       { element_type: 'asc' });
                   $scope.tableParams.voterResources =
                     $rootScope.createTableParams(
                       ngTableParams,
                       $filter,
                       results.voterResources,
                       $appProperties.lowPagination,
                       { element_type: 'asc' });
                   $scope.tableParams.contests =
                     $rootScope.createTableParams(
                       ngTableParams,
                       $filter,
                       results.contests,
                       $appProperties.lowPagination,
                       { element_type: 'asc' });
                   $scope.tableParams.sourceElection =
                     $rootScope.createTableParams(
                       ngTableParams,
                       $filter,
                       results.sourceElection,
                       $appProperties.lowPagination,
                       { element_type: 'asc' });
                 });

    $feedDataPaths.getResponse(
      {
        path: '/db/5.1/feeds/' + publicId + '/localities ',
        scope:  $scope,
        key: 'feedLocalities',
        errorMessage: 'Cound not retrieve Feed Localities.'
      },
      function(result) {
        $scope.localitiesTable = $rootScope.createTableParams(ngTableParams, $filter, result,
                                                              $appProperties.lowPagination, { name: 'asc' });
      });1
}
