'use strict';
/*
 * Feed Early Vote Sites Controller
 *
 */
function FeedEarlyVoteSitesCtrl($scope, $rootScope, $feedDataPaths, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {
  var feedid = $scope.vipfeed = $routeParams.vipfeed;

  $feedDataPaths.getResponse({ path: '/db/v3/feeds/' + feedid + '/earlyvotesites',
                               scope: $rootScope,
                               key: 'feedEarlyVoteSites',
                               errorMessage: 'Could not retrieve Feed Early Vote Sites.'},
                             function(result) { $scope.earlyVoteSitesTable = $rootScope.createTableParams(ngTableParams, $filter, result, $appProperties.highPagination, { id: 'asc' }); });

  $rootScope.setPageHeader("Early Vote Sites", $rootScope.getBreadCrumbs(), "feeds", "", null);
}
