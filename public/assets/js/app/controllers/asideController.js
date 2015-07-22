function AsideCtrl($scope, $rootScope, $feedDataPaths, $routeParams) {
  var feedid = $routeParams.vipfeed;

  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/error-total-count',
                               scope: $rootScope,
                               key: "errorCount",
                               errorMessage: "Could not retrieve Feed Error Count."},
                             function(result) { $rootScope.errorCount = result[0].count; });
}