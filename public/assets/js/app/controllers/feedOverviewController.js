'use strict';
/*
 * Feeds Overview Controller
 *
 */
function FeedOverviewCtrl($scope, $rootScope, $feedsService, $routeParams, $location) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  var breadcrumbs = [
    {
      name: "Feeds",
      url: "/#/feeds"
    },
    {
      name: feedid,
      url: $location.absUrl()
    }
  ];

  // initialize page header variables
  $rootScope.setPageHeader("", breadcrumbs, "feeds", null);
  $rootScope.pageHeader.error = "";

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.pageHeader.title = data.title;

      // now call the other services to get the rest of the data

      //FeedOverviewCtrl_getFeedPollingLocations($scope, $rootScope, $feedsService, feedid, data.polling_locations);
      //FeedOverviewCtrl_getFeedContests($scope, $rootScope, $feedsService, feedid, data.contests);
      //FeedOverviewCtrl_getFeedResults($scope, $rootScope, $feedsService, feedid, data.results);


    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed data. ";
    });
}

/*
 * Get the Feed Polling Locations for the Feed Overview page
 *
 */
function FeedOverviewCtrl_getFeedPollingLocations($scope, $rootScope, $feedsService, feedid, servicePath){

  // get Polling Locations
  $feedsService.getFeedPollingLocations(feedid, servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedPollingLocations = data;

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed Polling Locations. ";
    });

  // temp
  $scope.feedPollingLocations = [
    {
      elementType: "Random Polling Locations Element Type 1",
      amount: 0,
      completion: 0,
      errors: 0
    },
    {
      elementType: "Random Polling Locations Element Type 2",
      amount: Math.floor(Math.random()*500000),
      completion: Math.floor(Math.random()*100),
      errors: Math.floor(Math.random()*500000)
    },
    {
      elementType: "Random Polling Locations Element Type 3",
      amount: Math.floor(Math.random()*500000),
      completion: Math.floor(Math.random()*100),
      errors: Math.floor(Math.random()*500000)
    },
    {
      elementType: "Random Polling Locations Element Type 4",
      amount: Math.floor(Math.random()*500000),
      completion: Math.floor(Math.random()*100),
      errors: Math.floor(Math.random()*500000)
    },
    {
      elementType: "Random Polling Locations Element Type 5",
      amount: Math.floor(Math.random()*500000),
      completion: Math.floor(Math.random()*100),
      errors: Math.floor(Math.random()*500000)
    },
    {
      elementType: "Random Polling Locations Element Type 6",
      amount: Math.floor(Math.random()*500000),
      completion: Math.floor(Math.random()*100),
      errors: Math.floor(Math.random()*500000)
    }
  ];

}

/*
 * Get the Feed Contests for the Feed Overview page
 *
 */
function FeedOverviewCtrl_getFeedContests($scope, $rootScope, $feedsService, feedid, servicePath){

  // get Contests
  $feedsService.getFeedContests(feedid, servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedContests = data;

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed Contests. ";
    });

  // temp
  $scope.feedContests = [
    {
      elementType: "Random Contests Element Type 1",
      amount: 0,
      completion: 0,
      errors: 0
    },
    {
      elementType: "Random Contests Element Type 2",
      amount: Math.floor(Math.random()*500000),
      completion: Math.floor(Math.random()*100),
      errors: Math.floor(Math.random()*500000)
    },
    {
      elementType: "Random Contests Element Type 3",
      amount: Math.floor(Math.random()*500000),
      completion: Math.floor(Math.random()*100),
      errors: Math.floor(Math.random()*500000)
    },
    {
      elementType: "Random Contests Element Type 4",
      amount: Math.floor(Math.random()*500000),
      completion: Math.floor(Math.random()*100),
      errors: Math.floor(Math.random()*500000)
    },
    {
      elementType: "Random Contests Element Type 5",
      amount: Math.floor(Math.random()*500000),
      completion: Math.floor(Math.random()*100),
      errors: Math.floor(Math.random()*500000)
    },
    {
      elementType: "Random Contests Element Type 6",
      amount: Math.floor(Math.random()*500000),
      completion: Math.floor(Math.random()*100),
      errors: Math.floor(Math.random()*500000)
    }
  ];
}

/*
 * Get the Feed Results for the Feed Overview page
 *
 */
function FeedOverviewCtrl_getFeedResults($scope, $rootScope, $feedsService, feedid, servicePath){

  // get Results
  $feedsService.getFeedResults(feedid, servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedResults = data;

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed Results. ";
    });

  // temp
  $scope.feedResults = [
    {
      elementType: "Random Results Element Type 1",
      amount: 0,
      completion: 0,
      errors: 0
    },
    {
      elementType: "Random Results Element Type 2",
      amount: Math.floor(Math.random()*500000),
      completion: Math.floor(Math.random()*100),
      errors: Math.floor(Math.random()*500000)
    },
    {
      elementType: "Random Results Element Type 3",
      amount: Math.floor(Math.random()*500000),
      completion: Math.floor(Math.random()*100),
      errors: Math.floor(Math.random()*500000)
    },
    {
      elementType: "Random Results Element Type 4",
      amount: Math.floor(Math.random()*500000),
      completion: Math.floor(Math.random()*100),
      errors: Math.floor(Math.random()*500000)
    },
    {
      elementType: "Random Results Element Type 5",
      amount: Math.floor(Math.random()*500000),
      completion: Math.floor(Math.random()*100),
      errors: Math.floor(Math.random()*500000)
    },
    {
      elementType: "Random Results Element Type 6",
      amount: Math.floor(Math.random()*500000),
      completion: Math.floor(Math.random()*100),
      errors: Math.floor(Math.random()*500000)
    }
  ];
}