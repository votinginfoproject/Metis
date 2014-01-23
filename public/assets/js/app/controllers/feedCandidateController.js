/**
 * Created by rcartier13 on 1/23/14.
 */

function FeedCandidateCtrl($scope, $rootScope, $feedsService, $routeParams, $location) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  // initialize page header variables
  $rootScope.setPageHeader("Candidate", $rootScope.getBreadCrumbs(), "feeds", "", null);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // now call the other services to get the rest of the data
      FeedCandidateCtrl_getFeedCandidate($scope, $rootScope, $feedsService, $rootScope.getServiceUrl($location.path()));

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
      $scope.feedCandidate = {};
    });
};

function FeedCandidateCtrl_getFeedCandidate ($scope, $rootScope, $feedsService, servicePath) {
  $feedsService.getFeedCandidate(servicePath)
    .success(function(data) {

      // set the feeds data into the Angular model
      $scope.feedCandidate = data;

      // set the title
      $rootScope.pageHeader.title = "Candidate ID: " + data.id;
    }).error(function(data, $http) {
      $rootScope.pageHeader.error += "Could not retrieve Feed Candidate data. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedCandidate = {};
    });
}