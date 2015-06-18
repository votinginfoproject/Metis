'use strict';
/*
 * Feeds Source Controller
 *
 */
function FeedSourceCtrl($scope, $rootScope, $feedDataPaths, $feedsService, $routeParams, $location) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = $routeParams.vipfeed;

  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/election',
                               scope: $rootScope,
                               key: 'feedElection',
                               errorMessage: 'Cound not retrieve Feed Election Data.'},
                             function(result) {
                               $rootScope.feedElection = result[0];
                               $rootScope.feedElection['name'] = $rootScope.getBreadCrumbs()[0].name;
                             });
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/source',
                               scope: $rootScope,
                               key: 'feedSource',
                               errorMessage: 'Cound not retrieve Feed Source Data.'},
                             function(result) {
                               $rootScope.feedSource = result[0];
                             });

  // initialize page header variables
  $rootScope.setPageHeader("Source & Election", $rootScope.getBreadCrumbs(), "feeds", "" ,null);
}