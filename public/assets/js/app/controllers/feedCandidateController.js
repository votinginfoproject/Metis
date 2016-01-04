/**
 * Created by rcartier13 on 1/23/14.
 */

function FeedCandidateCtrl($scope, $rootScope, $feedDataPaths, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $scope.vipfeed = $routeParams.vipfeed;
  var contestid = $routeParams.contest;
  var candidateid = $routeParams.candidate;

  $feedDataPaths.getResponse({ path: '/db/v3/feeds/' + feedid + '/contests/' + contestid + '/ballot/candidates/' + candidateid,
                               scope: $rootScope,
                               key: 'feedCandidate',
                               errorMessage: 'Could not retrieve Candidate Data.'},
                             function(result) { $rootScope.feedCandidate = result[0]; });

  // initialize page header variables
  $rootScope.setPageHeader("Candidate", $rootScope.getBreadCrumbs(), "feeds", "", null);
};
