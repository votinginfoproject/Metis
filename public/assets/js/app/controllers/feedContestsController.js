'use strict';
/**
 * Created by rcartier13 on 1/17/14.
 */

function FeedContestsCtrl($scope, $rootScope, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {

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
      FeedContestsCtrl_getFeedContests($scope, $rootScope, $feedsService, $rootScope.getServiceUrl($location.path()), $appProperties, $filter, ngTableParams);
      FeedContestsOverviewCtrl_getFeedContestsOverview($scope, $rootScope, $feedsService, data.contests, $appProperties, $filter, ngTableParams);


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
      $scope.feedContests = {};
    });
}

function FeedContestsCtrl_getFeedContests($scope, $rootScope, $feedsService, servicePath, $appProperties, $filter, ngTableParams) {

  $feedsService.getFeedContests(servicePath)
    .success(function(data) {


      // set the feeds data into the Angular model
      $scope.feedContests = data;

      // sets the defaults for the table sorting parameters
      $scope.contestsTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, $appProperties.highPagination, { id: 'asc' });

      // set the title
      $rootScope.pageHeader.title = $scope.feedContests.length + " Contests";
    }).error(function(data, $http) {
      $rootScope.pageHeader.error += "Could not retrieve Feed Contests data. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedContests = {};
    });
}

function FeedContestsOverviewCtrl_getFeedContestsOverview($scope, $rootScope, $feedsService, servicePath, $appProperties, $filter, ngTableParams) {

  $feedsService.getFeedContests(servicePath)
    .success(function(data) {


      // set the feeds data into the Angular model
      $scope.feedContests = data;

      // sets the defaults for the table sorting parameters
      $scope.contestsTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, $appProperties.highPagination, { id: 'asc' });

      // set the title
      $rootScope.pageHeader.title = $scope.feedContests.length + " Contests";
    }).error(function(data, $http) {
      $rootScope.pageHeader.error += "Could not retrieve Feed Contests data. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedContests = {};
    });
}
