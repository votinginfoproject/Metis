'use strict';

function FeedErrors51Ctrl($scope, $rootScope, $routeParams, $feedDataPaths) {
  var publicId = $routeParams.vipfeed;
  $scope.publicId = publicId;
  $scope.pageHeader.title = 'Errors';

  $rootScope.setPageHeader("Errors", [], "feeds", "", null);

  $scope.errors = null;

  $scope._toggleError = function (index) {
    var obj = jQuery("#errorDetail" + index);
    var arrowClosed = jQuery("#errorArrowClosed" + index);
    var arrowOpen = jQuery("#errorArrowOpen" + index);

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
                               errorMessage: 'Cound not retrieve errors' });
}
