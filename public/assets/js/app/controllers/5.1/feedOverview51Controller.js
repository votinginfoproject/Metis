'use strict';

function FeedOverview51Ctrl($scope, $rootScope, $feedDataPaths, $routeParams) {
  var publicId = $scope.publicId = $routeParams.vipfeed;
  $rootScope.errorReport = "/db/feeds/" + publicId + "/xml/errors/report";

  $feedDataPaths.getResponse({path: '/db/feeds/' + publicId + '/xml/overview',
                              scope:  $rootScope,
                              key: 'overviewData',
                              errorMessage: 'Cound not retrieve Feed Overview Data.'},
                             function(result) {
                               var row = result[0];
                               $scope.pageTitle = row.election_date + " " +
                                                  row.election_type + " " +
                                                  row.state_name;
                               $rootScope.pageTitle = $scope.pageTitle;
                               $rootScope.setPageHeader($scope.pageTitle, [], 'v5-feeds', null, null);
                             });
}
