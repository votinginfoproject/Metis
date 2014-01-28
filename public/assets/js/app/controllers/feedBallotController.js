/**
 * Created by rcartier13 on 1/28/14.
 */

function FeedBallotCtrl($scope, $rootScope, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {
  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  // initialize page header variables
  $rootScope.setPageHeader("Ballot", $rootScope.getBreadCrumbs(), "feeds", "", null);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // now call the other services to get the rest of the data
      FeedBallotCtrl_getFeedBallot($scope, $rootScope, $feedsService, $rootScope.getServiceUrl($location.path()), $appProperties, $filter, ngTableParams);

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
      $scope.feedBallot = {};
    });
};

function FeedBallotCtrl_getFeedBallot($scope, $rootScope, $feedsService, servicePath, $appProperties, $filter, ngTableParams) {
  $feedsService.getFeedBallot(servicePath)
    .success(function(data) {

      $scope.feedBallot = data;

      $rootScope.pageHeader.title = "Ballot ID: " + data.id;

      $scope.ballotCandidatesTableParams = $rootScope.createTableParams(ngTableParams, $filter, data.candidates, $appProperties.lowPagination, { id: 'asc' });
      $scope.referendaTableParams = $rootScope.createTableParams(ngTableParams, $filter, data.referenda, $appProperties.lowPagination, { id: 'asc' });
      $scope.customBallotResponsesTableParams = $rootScope.createTableParams(ngTableParams, $filter, data.custom_ballot.ballot_responses, $appProperties.lowPagination, { id: 'asc' });

    }).error(function(data) {
      $rootScope.pageHeader.error += "Could not retrieve Ballot data."

      $scope.feedBallot = {};
    });
}