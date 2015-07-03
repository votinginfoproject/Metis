/**
 * Created by rcartier13 on 1/21/14.
 */

function FeedContestCtrl($scope, $rootScope, $feedDataPaths, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $scope.vipfeed = $routeParams.vipfeed;  
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
  
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/contests/' + contestid + '/contest-electoral-district',
                               scope:  $rootScope,
                               key: 'feedContestElectoralDistrict',
                               errorMessage: 'Cound not retrieve Electoral District Data for Contest ' + contestid + '.'},
                             function(result) { $rootScope.feedContestElectoralDistrict = result[0]; });
  
  $rootScope.feedContestOverview = {};
  ContestOverviewTable($feedDataPaths, $rootScope.feedContestOverview, feedid, contestid);

  // initialize page header variables
  $rootScope.setPageHeader("Contest", $rootScope.getBreadCrumbs(), "feeds", "", null);
}

function ContestOverviewTable($feedDataPaths, overview, feedid, contestid) {
  var overviewBallotLink = '#/feeds/' + feedid + '/election/contests/' + contestid + '/overview/ballot/errors';
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/contests/' + contestid + '/overview/ballot',
                               scope: overview,
                               key: 'ballot',
                               errorMessage: 'Could not retrieve Overview Data.'},
                             function(result) {
                              overview.ballot = result[0];
                              overview.ballot["elementType"] = "Ballot";
                              overview.ballot["link"] = overviewBallotLink;
                            });

  var overviewReferendaLink = '#/feeds/' + feedid + '/election/contests/' + contestid + '/overview/referenda/errors';
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/contests/' + contestid + '/overview/referenda',
                               scope: overview,
                               key: 'referenda',
                               errorMessage: 'Could not retrieve Overview Data.'},
                             function(result) {
                              overview.referenda = result[0];
                              overview.referenda["elementType"] = "Referenda";
                              overview.referenda["link"] = overviewReferendaLink;
                            });

  var overviewCandidatesLink = '#/feeds/' + feedid + '/election/contests/' + contestid + '/overview/candidates/errors';
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/contests/' + contestid + '/overview/candidates',
                               scope: overview,
                               key: 'candidates',
                               errorMessage: 'Could not retrieve Overview Data.'},
                             function(result) {
                              overview.candidates = result[0];
                              overview.candidates["elementType"] = "Candidates";
                              overview.candidates["link"] = overviewCandidatesLink;
                            });

  var overviewElectoralDistrictLink = '#/feeds/' + feedid + '/election/contests/' + contestid + '/overview/electoraldistrict/errors';
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/contests/' + contestid + '/overview/electoral-districts',
                               scope: overview,
                               key: 'electoralDistrict',
                               errorMessage: 'Could not retrieve Overview Data.'},
                             function(result) {
                              overview.electoralDistrict = result[0];
                              overview.electoralDistrict["elementType"] = "Electoral District";
                              overview.electoralDistrict["link"] = overviewElectoralDistrictLink;
                            });
}