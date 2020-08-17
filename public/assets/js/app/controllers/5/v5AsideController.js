'use strict';
function v5AsideController($scope, $rootScope, $feedDataPaths, $routeParams) {
  var publicId = $rootScope.publicId = $routeParams.vipfeed;

  $rootScope.feedURL = function(path) {
    return "#/5/feeds/" + $rootScope.publicId + path;
  };

  $feedDataPaths.getResponse({path: '/db/feeds/' + publicId + '/xml/error-total-count',
                              scope: $rootScope,
                              key: "errorCount",
                              errorMessage: "Could not retrieve Feed Error Count."},
                             function(result) { $rootScope.errorCount = result[0]; });
}
