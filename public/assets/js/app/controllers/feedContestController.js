/**
 * Created by rcartier13 on 1/21/14.
 */

function FeedContestCtrl($scope, $rootScope, $feedDataPaths, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;
  
  var contestid = $routeParams.contest;

  var errorPath = $feedDataPaths.getFeedValidationsErrorCountPath(feedid);
  $feedDataPaths.getResponse({ path: errorPath,
                               scope: $rootScope,
                               key: "errorCount",
                               errorMessage: "Could not retrieve Feed Error Count."});
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/contests/' + contestid,
                               scope:  $rootScope,
                               key: 'feedContest',
                               errorMessage: 'Cound not retrieve Contest ' + contestid + ' Data.'},
                             function(result) { $rootScope.feedContest = result[0]; });
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/contests/' + contestid + '/ballot',
                               scope:  $rootScope,
                               key: 'feedContestBallot',
                               errorMessage: 'Cound not retrieve Ballot Data for Contest ' + contestid + '.'},
                             function(result) { $rootScope.feedContestBallot = result[0]; });
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/contests/' + contestid + '/electoral-district',
                               scope:  $rootScope,
                               key: 'feedContestElectoralDistrict',
                               errorMessage: 'Cound not retrieve Electoral District Data for Contest ' + contestid + '.'},
                             function(result) { $rootScope.feedContestElectoralDistrict = result[0]; });
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/contests/' + contestid + '/result',
                               scope:  $rootScope,
                               key: 'feedContestResult',
                               errorMessage: 'Cound not retrieve Contest Result Data for Contest ' + contestid + '.'},
                             function(result) { $rootScope.feedContestResult = result[0]; });
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/contests/' + contestid + '/ballot-line-results',
                               scope:  $rootScope,
                               key: 'feedContestBallotLineResults',
                               errorMessage: 'Cound not retrieve Ballot Line Results Data for Contest ' + contestid + '.'},
                             function(result) { $scope.ballotLineResultTableParams = $rootScope.createTableParams(ngTableParams, $filter, result, $appProperties.lowPagination, { id: 'asc' }); });
  // initialize page header variables
  $rootScope.setPageHeader("Contest", $rootScope.getBreadCrumbs(), "feeds", "", null);
}