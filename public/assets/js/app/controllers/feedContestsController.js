'use strict';
/**
 * Created by rcartier13 on 1/17/14.
 */

function FeedContestsCtrl($scope, $rootScope, $feedDataPaths, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {
  var feedid = $scope.vipfeed = $routeParams.vipfeed;

  var errorPath = $feedDataPaths.getFeedValidationsErrorCountPath(feedid);
  $feedDataPaths.getResponse({ path: errorPath,
                               scope: $rootScope,
                               key: "errorCount",
                               errorMessage: "Could not retrieve Feed Error Count."});
  
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/contests',
                               scope: $rootScope,
                               key: "feedContests",
                               errorMessage: "Could not retrieve Feed Contests data. "},
                             function(data) {
                               $scope.contestsTable = $rootScope.createTableParams(ngTableParams, $filter, data, $appProperties.highPagination, { id: 'asc' });
                               $rootScope.pageHeader.title = data.length + " Contests";
                             });
  
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/overview',
                               scope: $rootScope,
                               key: "feedContestsOverview",
                               errorMessage: "Could not retrieve Feed Contests Overview data."},
                             function(result) {
                              $rootScope.feedContestsOverview = result[0]["contests"];
                              $scope.contestsOverviewTable = $rootScope.createTableParams(ngTableParams, $filter, result[0]["contests"], $appProperties.highPagination, { id: 'asc' });
                            });

  $rootScope.setPageHeader("Contests", $rootScope.getBreadCrumbs(), "feeds", "", null);
}