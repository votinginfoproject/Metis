/**
 * Created by rcartier13 on 1/29/14.
 */

function FeedReferendumCtrl($scope, $rootScope, $feedDataPaths, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {
  // get the vipfeed param from the route
  var feedid = $scope.vipfeed = $routeParams.vipfeed;
  var referendumid = $routeParams.referendum;

  $feedDataPaths.getResponse({ path: '/db/v3/feeds/' + feedid + '/referendum/' + referendumid,
                               scope: $rootScope,
                               key: 'feedReferendum',
                               errorMessage: 'Could not retrieve Referendum Data.'},
                             function(result) { $rootScope.feedReferendum = result[0]; });

  $feedDataPaths.getResponse({ path: '/db/v3/feeds/' + feedid + '/referendum/' + referendumid + '/ballot-responses',
                               scope: $rootScope,
                               key: 'feedBallotResponses',
                               errorMessage: 'Could not retrieve Ballot Response Data for Referendum ' + referendumid + '.'});

  // initialize page header variables
  $rootScope.setPageHeader("Referendum", $rootScope.getBreadCrumbs(), "feeds", "", null);
};
