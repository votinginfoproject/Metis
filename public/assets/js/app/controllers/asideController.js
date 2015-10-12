function AsideCtrl($scope, $rootScope, $feedDataPaths, $routeParams) {
  var feedid = $routeParams.vipfeed;

  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/error-total-count',
                               scope: $rootScope,
                               key: "errorCount",
                               errorMessage: "Could not retrieve Feed Error Count."},
                             function(result) { $rootScope.errorCount = result[0]; });

  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/unapprovable',
                               scope: $rootScope,
                               key: 'feedIsApprovable',
                               errorMessage: 'Could not determine if the feed can be approved.'},
                             function(result) { $rootScope.feedIsApprovable = !result[0]['exists']; })
}