/**
 * Created by rcartier13 on 1/21/14.
 */

function FeedContestCtrl($scope, $rootScope, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  // initialize page header variables
  $rootScope.setPageHeader("Contest", $rootScope.getBreadCrumbs(), "feeds", "", null);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // now call the other services to get the rest of the data
      FeedContestCtrl_getFeedContests($scope, $rootScope, $feedsService, $rootScope.getServiceUrl($location.path()), $appProperties, $filter, ngTableParams);

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
      $scope.feedContest = {};
      $scope.feedBallot = {};
      $scope.feedCandidates = {};
    });
}

function FeedContestCtrl_getFeedContests($scope, $rootScope, $feedsService, servicePath, $appProperties, $filter, ngTableParams) {

  $feedsService.getFeedContest(servicePath)
    .success(function(data) {

      // set the feeds data into the Angular model
      $scope.feedContest = data;

      $scope.ballotLineResultTableParams = $rootScope.createTableParams(ngTableParams, $filter, data.ballot_line_results, $appProperties.lowPagination, { id: 'asc' });

      FeedContestCtrl_getFeedContestBallot($scope, $rootScope, $feedsService, data.ballot);

      // set the title
      $rootScope.pageHeader.title = "Contest ID: " + data.id;

    }).error(function(data, $http) {
      $rootScope.pageHeader.error += "Could not retrieve Feed Contest data. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedContest = {};
      $scope.feedBallot = {};
      $scope.feedCandidates = {};
    });
};

function FeedContestCtrl_getFeedContestBallot($scope, $rootScope, $feedsService, servicePath) {
  $feedsService.getFeedContestBallot(servicePath)
    .success(function(data) {
      $scope.feedBallot = data;

    }).error(function(data, $http) {
      $rootScope.pageHeader.error += "Could not retrieve Feed Ballot data. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedBallot = {};
    });
};