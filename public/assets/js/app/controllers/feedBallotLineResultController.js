/**
 * Created by rcartier13 on 1/30/14.
 */

function FeedBallotLineResultCtrl($scope, $rootScope, $feedsService, $routeParams, $location) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  // initialize page header variables
  $rootScope.setPageHeader("Ballot Line Result", $rootScope.getBreadCrumbs(), "feeds", "", null);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // now call the other services to get the rest of the data
      FeedBallotLineResultCtrl_getFeedBallotLineResult($scope, $rootScope, $feedsService, $rootScope.getServiceUrl($location.path()));

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
      $scope.feedBallotLineResult = {};
    });
};

function FeedBallotLineResultCtrl_getFeedBallotLineResult ($scope, $rootScope, $feedsService, servicePath) {
  $feedsService.getFeedBallotLineResult(servicePath)
    .success(function(data) {
      data.contest.self = data.contest.self.replace('/services/', '/#/');
      data.candidate.self = data.candidate.self.replace('/services/', '/#/');
      data.jurisdiction.self = data.jurisdiction.self.replace('/services/', '/#/');

      // set the feeds data into the Angular model
      $scope.feedBallotLineResult = data;

      // set the title
      $rootScope.pageHeader.title = "Ballot Line Result ID: " + data.id;
    }).error(function(data, $http) {
      $rootScope.pageHeader.error += "Could not retrieve Feed Ballot Line Result data. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedBallotLineResult = {};
    });
}