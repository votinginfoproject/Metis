'use strict';
/*
 * Feeds Election Controller
 *
 */
function FeedElectionCtrl($scope, $rootScope, $feedsService, $routeParams, $location) {

  // get the vipfeed param from the route
  $scope.vipfeed = $routeParams.vipfeed;

  var breadcrumbs = [
    {
      name: "Feeds",
      url: "/#/feeds"
    },
    {
      name: $routeParams.vipfeed,
      url: "/#/feeds/" + $scope.vipfeed
    },
    {
      name: "Election",
      url: $location.absUrl()
    }
  ];

  // initialize page header variables
  $rootScope.setPageHeader("", breadcrumbs, "feeds", null);
  $rootScope.pageHeader.error = "";

  // get general Feed data
  $feedsService.getFeedData()
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedData = data;

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed data. ";
    });

  // temp
  $scope.feedData = {
    title: "Election Title",
    totalErrors: "XXX",
    dueDate: "XXXX/XX/XX"
  };

  $rootScope.pageHeader.title = $scope.feedData.title;

  // get Feed Election
  $feedsService.getFeedElection()
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedElection = data;

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed Election. ";
    });

  // temp
  $scope.feedElection = {
    date: "2013/12/21",
    electionType: "Federal",
    statewide: "Value",
    registrationInfo: "http://www.link1.com",
    absenteeBallotInfo: "http://www.link2.com",
    resultsUrl: "http://www.link3.com",
    pollingHours: "9am-5pm",
    electionDayRegistration: "No",
    registrationDeadLine: "2013/11/23",
    absenteeRequestDeadline: "2013/11/23"
  };

  // get Feed State
  $feedsService.getFeedState()
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedState = data;

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed State. ";
    });

  // temp
  $scope.feedState = {
    id: 123,
    name: "Virginia",
    localities: 234
  };

  // get Feed State
  $feedsService.getFeedElectionContests()
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedElectionContests = data;

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed Contests. ";
    });

  // temp
  $scope.feedElectionContests = [
    {
      id: 600001,
      type: "General",
      office: "US President"
    },
    {
      id: 600002,
      type: "General",
      office: "State Treasurer"
    },
    {
      id: 600003,
      type: "Referendum",
      office: "Proposition 123"
    }
  ];
}