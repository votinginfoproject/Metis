'use strict';
/*
 * Feeds Overview Controller
 *
 */
function FeedOverviewCtrl($scope, $rootScope, $feedDataPaths, $feedsService, $routeParams, $location, $appProperties, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  var errorPath = $feedDataPaths.getFeedValidationsErrorCountPath(feedid);
  $feedDataPaths.getResponse({ path: errorPath,
                               scope: $rootScope,
                               key: "errorCount",
                               errorMessage: "Could not retrieve Feed Error Count."});
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/overview',
                               scope:  $rootScope,
                               key: 'overviewData',
                               errorMessage: 'Cound not retrieve Feed Overview Data.'});
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/localities ',
                               scope:  $rootScope,
                               key: 'feedLocalities',
                               errorMessage: 'Cound not retrieve Feed Localities.'});

  // initialize page header variables
  $rootScope.setPageHeader("", $rootScope.getBreadCrumbs(), "feeds", "", null);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data, $http) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // set the title
      $rootScope.pageHeader.title = data.title;

    }).error(function (data, $http) {

      if($http===404){
        // feed not found

        $rootScope.pageHeader.alert = "Sorry, the VIP feed \"" + feedid + "\" does not exist.";
      } else {
        // some other error

        $rootScope.pageHeader.error += "Could not retrieve Feed data. ";
      }

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedData = {};
      $scope.feedPollingLocations = {};
      $scope.feedContests = {};
      $scope.feedLocalities = {};
      $scope.feedCounties = {};
      $scope.feedSource = {};
      $scope.feedElection = {};
    });
}
