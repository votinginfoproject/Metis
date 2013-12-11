'use strict';
/*
 * Feeds Detail Controller
 *
 */
function FeedDetailCtrl($scope, $rootScope, $feedsService, $routeParams, $location) {

  // get the vipfeed param from the route
  $scope.vipfeed = $routeParams.vipfeed;

  // get the vipfeed-detail param from the route
  $scope.vipfeeddetail = $routeParams.vipfeeddetail;

  var breadcrumbs = [
    {
      name: "Feeds",
      url: "/#/feeds"
    },
    {
      name: $routeParams.vipfeed,
      url: $location.absUrl()
    }
  ];

  // initialize page header variables
  $rootScope.setPageHeader("", breadcrumbs, "feeds", null);
  $rootScope.pageHeader.error = "";

  // get general Feed Overview data
  $feedsService.getFeedOverViewData()
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedOverviewData = data;

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed Overview data. ";
    });

  // temp
  $scope.feedOverviewData = {
    feedTitle: "Feed Overview Title",
    totalFeedErrors: "XXX",
    dueDate: "XXXX/XX/XX"
  };

  $rootScope.pageHeader.title = $scope.feedOverviewData.feedTitle;

  // get Polling Locations
  $feedsService.getFeedPollingLocations()
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

  // get Contests
  $feedsService.getFeedContests()
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

  // get Results
  $feedsService.getFeedResults()
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
