/**
 * Created by rcartier13 on 1/29/14.
 */

function FeedReferendumCtrl($scope, $rootScope, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {
  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  // initialize page header variables
  $rootScope.setPageHeader("Referendum", $rootScope.getBreadCrumbs(), "feeds", "", null);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // now call the other services to get the rest of the data
      FeedReferendumCtrl_getFeedReferendum($scope, $rootScope, $feedsService, $rootScope.getServiceUrl($location.path()), $appProperties, $filter, ngTableParams);

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
      $scope.feedReferendum = {};
    });
};

function FeedReferendumCtrl_getFeedReferendum($scope, $rootScope, $feedsService, servicePath, $appProperties, $filter, ngTableParams) {

  $feedsService.getFeedReferendum(servicePath)
    .success(function (data) {
      $scope.feedReferendum = data;

      $rootScope.pageHeader.title = "Referendum ID: " + data.id;

    }).error(function (data) {
      $rootScope.pageHeader.error += "Could not retrieve Referendum data. ";

      $scope.feedReferendum = {};
    });
};