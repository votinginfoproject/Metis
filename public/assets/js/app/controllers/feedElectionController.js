'use strict';
/*
 * Feeds Election Controller
 *
 */
function FeedElectionCtrl($scope, $rootScope, $feedDataPaths, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/election',
                               scope: $rootScope,
                               key: 'feedElection',
                               errorMessage: 'Cound not retrieve Feed Election Data.'},
                             function(result) {
                               $rootScope.feedElection = result[0];
                               $rootScope.feedElection['name'] = $rootScope.getBreadCrumbs()[0].name;
                             });
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/election/state',
                               scope: $rootScope,
                               key: 'feedState',
                               errorMessage: 'Cound not retrieve Feed State Data.'},
                             function(result) { $rootScope.feedState = result[0]; });
  $feedDataPaths.getResponse({ path: $feedDataPaths.getFeedContestsPath(feedid),
                               scope: $rootScope,
                               key: "feedContests",
                               errorMessage: "Could not retrieve Feed Contests data. "},
                             function(data) {
                               $scope.contestsTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, $appProperties.highPagination, { id: 'asc' });
                             });

  // initialize page header variables
  $rootScope.setPageHeader("Election", $rootScope.getBreadCrumbs(), "feeds", "", null);
}