/**
 * Created by rcartier13 on 1/30/14.
 */

function FeedContestResultCtrl($scope, $rootScope, $feedsService, $routeParams, $location) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  // initialize page header variables
  $rootScope.setPageHeader("Contest Result", $rootScope.getBreadCrumbs(), "feeds", "", null);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // now call the other services to get the rest of the data
      FeedContestResultCtrl_getFeedContestResult($scope, $rootScope, $feedsService, $rootScope.getServiceUrl($location.path()));

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
      $scope.feedContestResult = {};
    });
}

function FeedContestResultCtrl_getFeedContestResult($scope, $rootScope, $feedsService, servicePath) {

  $feedsService.getFeedContestResult(servicePath)
    .success(function(data) {
      data.contest.self = data.contest.self.replace("/services/","/#/");
      data.jurisdiction.self = data.jurisdiction.self.replace("/services/", "/#/");
      // set the feeds data into the Angular model
      $scope.feedContestResult = data;
      // set the title
      $rootScope.pageHeader.title = "Contest Result ID: " + data.id;


    }).error(function(data, $http) {
      $rootScope.pageHeader.error += "Could not retrieve Feed Contest Result data. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedContestResult = {};
    });
};