'use strict';

function FeedErrors51Ctrl($scope, $rootScope, $routeParams, $feedDataPaths) {
  var publicId = $routeParams.vipfeed;
  $scope.publicId = publicId;
  $scope.pageHeader.title = 'Errors';

  $rootScope.setPageHeader("Errors", [], "feeds", "", null);

  $scope.errors = null;

  $scope._toggleError = function (prefix, index) {
    var obj = jQuery("#" + prefix + "ErrorDetail" + index);
    var arrowClosed = jQuery("#" + prefix + "ErrorArrowClosed" + index);
    var arrowOpen = jQuery("#" + prefix + "ErrorArrowOpen" + index);

    if (obj.is(":visible")) {
      obj.hide();
      arrowClosed.show();
      arrowOpen.hide();
    } else {
      obj.show();
      arrowClosed.hide();
      arrowOpen.show();
    }
  }
  $scope.toggleError = $scope._toggleError;

  $feedDataPaths.getResponse({ path: '/db/feeds/' + publicId + '/xml/errors/summary',
                               scope:  $scope,
                               key: 'errors',
                               errorMessage: 'Cound not retrieve errors' },
                             function (results) {
                               $scope.fatalErrors = results.filter(function(row) {
                                 return row.severity === 'fatal' || row.severity === 'critical';
                               });
                               $scope.minorErrors = results.filter(function(row) {
                                 return row.severity === 'warnings' || row.severity === 'errors';
                               });
                             });
}
