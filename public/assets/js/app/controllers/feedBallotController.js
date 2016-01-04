/**
 * Created by rcartier13 on 1/28/14.
 */

function FeedBallotCtrl($scope, $rootScope, $feedDataPaths, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {
  // get the vipfeed param from the route
  var feedid = $scope.vipfeed = $rootScope.vipfeed = $routeParams.vipfeed;
  var contestid = $routeParams.contest;

  $feedDataPaths.getResponse({ path: '/db/v3/feeds/' + feedid + '/contests/' + contestid,
                               scope: $rootScope,
                               key: 'feedContest',
                               errorMessage: 'Could not retrieve related Contest Data.'},
                             function(result) { $rootScope.feedContest = result[0]; });

  $feedDataPaths.getResponse({ path: '/db/v3/feeds/' + feedid + '/contests/' + contestid + '/ballot',
                               scope: $rootScope,
                               key: 'feedBallot',
                               errorMessage: 'Could not retrieve Ballot Data for Contest ' + contestid + '.'},
                             function(result) { $rootScope.feedBallot = result[0]; });

  $feedDataPaths.getResponse({ path: '/db/v3/feeds/' + feedid + '/contests/' + contestid + '/ballot/candidates',
                               scope: $rootScope,
                               key: 'feedCandidates',
                               errorMessage: 'Could not retrieve Candidate Data.'},
                             function(result) { $scope.ballotCandidatesTableParams = $rootScope.createTableParams(ngTableParams, $filter, result, $appProperties.lowPagination, { id: 'asc' }); });

  $feedDataPaths.getResponse({ path: '/db/v3/feeds/' + feedid + '/contests/' + contestid + '/ballot/referendum',
                               scope: $rootScope,
                               key: 'feedReferendum',
                               errorMessage: 'Could not retrieve Referendum Data.'},
                             function(result) { $rootScope.feedReferendum = result[0]; });

  $feedDataPaths.getResponse({ path: '/db/v3/feeds/' + feedid + '/contests/' + contestid + '/ballot/custom-ballot',
                               scope: $rootScope,
                               key: 'feedCustomBallot',
                               errorMessage: 'Could not retrieve Custom Ballot Data.'},
                             function(result) { $rootScope.feedCustomBallot = result[0]; });

  $feedDataPaths.getResponse({ path: '/db/v3/feeds/' + feedid + '/contests/' + contestid + '/ballot/custom-ballot-responses',
                               scope: $rootScope,
                               key: 'feedCustomBallotResponses',
                               errorMessage: 'Could not retrieve Custom Ballot Response Data.'});

  // initialize page header variables
  $rootScope.setPageHeader("Ballot", $rootScope.getBreadCrumbs(), "feeds", "", null);
}
