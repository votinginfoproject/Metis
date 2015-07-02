'use strict';
/*
 * Feed Early Vote Site Controller
 *
 */
function FeedEarlyVoteSiteCtrl($scope, $rootScope, $feedDataPaths, $feedsService, $routeParams, $appProperties, $location, $filter, $sce, ngTableParams) {

  var feedid = $scope.vipfeed = $routeParams.vipfeed;
  var earlyvotesiteid = $routeParams.earlyvotesite;

  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/earlyvotesites/' + earlyvotesiteid,
                               scope: $rootScope,
                               key: 'feedEarlyVoteSite',
                               errorMessage: 'Could not retrieve Early Vote Site Data.'},
                             function(result) { 
                              $rootScope.feedEarlyVoteSite = result[0]; 
                              $rootScope.feedEarlyVoteSite["days_times_open"] = $sce.trustAsHtml($rootScope.feedEarlyVoteSite["days_times_open"]);
                            });
  
  $rootScope.setPageHeader("Early Vote Site", $rootScope.getBreadCrumbs(), "feeds", "", null);
}