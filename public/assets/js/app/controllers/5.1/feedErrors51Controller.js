'use strict';

function FeedErrors51Ctrl($scope, $rootScope, $routeParams, $errorsService, $feedDataPaths) {
  var publicId = $routeParams.vipfeed;
  $scope.publicId = publicId;
  $scope.pageHeader.title = 'Errors';

  $rootScope.setPageHeader("Errors", [], "feeds", "", null);

  $scope.errors = null;

  $scope.toggleError = $errorsService.toggleError;

  $feedDataPaths.getResponse({ path: '/db/feeds/' + publicId + '/xml/errors/summary',
                               scope:  $scope,
                               key: 'errors',
                               errorMessage: 'Cound not retrieve errors' },
                             function (results) {
                               $errorsService.splitErrors($scope, results);
                             });
}
