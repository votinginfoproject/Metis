'use strict';

function LocalityOverview51Ctrl($scope, $rootScope, $feedDataPaths, $routeParams,
                                $appProperties, $filter, ngTableParams) {
  var publicId = $rootScope.publicId = $routeParams.vipfeed;
  var localityId = $rootScope.localityId = $routeParams.locality;

  $feedDataPaths
    .getResponse({path: 'db/5.1/feeds/' + $rootScope.publicId + '/election/state/localities/' + localityId,
                  scope: $scope,
                  key: 'summaries',
                  errorMessage: 'Could not get summary data'},
                 function (results) {
                   $scope.locality = results.locality;

                   $scope.tableParams = {};

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
                 });
}
