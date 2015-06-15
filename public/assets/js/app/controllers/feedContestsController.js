'use strict';
/**
 * Created by rcartier13 on 1/17/14.
 */

function FeedContestsCtrl($scope, $rootScope, $feedDataPaths, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  // initialize page header variables
  $rootScope.setPageHeader("Contests", $rootScope.getBreadCrumbs(), "feeds", "", null);

  var errorPath = $feedDataPaths.getFeedValidationsErrorCountPath(feedid);
  $feedDataPaths.getResponse({ path: errorPath,
                               scope: $rootScope,
                               key: "errorCount",
                               errorMessage: "Could not retrieve Feed Error Count."});

  FeedContestsCtrl_getFeedContests($scope, $rootScope, $feedDataPaths, $feedsService, $rootScope.getServiceUrl($location.path()), $appProperties, $filter, ngTableParams);

  $feedDataPaths.getResponse({ path: $feedDataPaths.getContestsOverviewTablePath(feedid),
                               scope: $rootScope,
                               key: "contestsOverviewTable",
                               errorMessage: "Could not retrieve Feed Contests Overview data."});
}

function FeedContestsCtrl_getFeedContests($scope, $rootScope, $feedDataPaths, $feedsService, servicePath, $appProperties, $filter, ngTableParams) {

  var feedid = $scope.vipfeed;

  $feedDataPaths.getResponse({ path: $feedDataPaths.getFeedContestsPath(feedid),
                               scope: $rootScope,
                               key: "feedContests",
                               errorMessage: "Could not retrieve Feed Contests data. "},
                             function(data) {
                               $scope.contestsTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, $appProperties.highPagination, { id: 'asc' });
                               $rootScope.pageHeader.title = data.length + " Contests";
                             });
}
