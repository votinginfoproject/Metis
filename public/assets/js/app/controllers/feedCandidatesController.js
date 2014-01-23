/**
 * Created by rcartier13 on 1/23/14.
 */

function FeedCandidatesCtrl($scope, $rootScope, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  // initialize page header variables
  $rootScope.setPageHeader("Contests", $rootScope.getBreadCrumbs(), "feeds", "", null);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // now call the other services to get the rest of the data
      FeedContestsCtrl_getFeedCandidates($scope, $rootScope, $feedsService, $rootScope.getServiceUrl($location.path()), $appProperties, $filter, ngTableParams);

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
      $scope.feedCandidates = {};
    });
}

function FeedContestsCtrl_getFeedCandidates($scope, $rootScope, $feedsService, servicePath, $appProperties, $filter, ngTableParams) {

  $feedsService.getFeedContestCandidate(servicePath)
    .success(function(data) {

      // set the feeds data into the Angular model
      $scope.feedCandidates = data;

      // sets the defaults for the table sorting parameters
      $scope.candidatesTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, $appProperties.highPagination, { id: 'asc' });

      // set the title
      $rootScope.pageHeader.title = $scope.feedCandidates.length + " Contests";
    }).error(function(data, $http) {
      $rootScope.pageHeader.error += "Could not retrieve Feed Contests data. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedCandidates = {};
    });
}