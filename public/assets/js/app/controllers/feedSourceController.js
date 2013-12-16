'use strict';
/*
 * Feeds Source Controller
 *
 */
function FeedSourceCtrl($scope, $rootScope, $feedsService, $routeParams, $location) {

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
      name: "Source",
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
    title: "Source Title",
    totalErrors: "XXX",
    dueDate: "XXXX/XX/XX"
  };

  $rootScope.pageHeader.title = $scope.feedData.title;

  // get Feed Source
  $feedsService.getFeedSource($routeParams.vipfeed)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedSource = data;

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed Source. ";
    });

  // temp
  $scope.feedSource = {
    name: "VA State Board of Elections",
    dateTime: "2014/12/12",
    description: "The VA State Board of Elections is the official source of election information for VA.",
    organizationUrl: "http://www.va.gov",
    touUrl: "http://www.anotherURL.com"
  };

  // get Feed Contact
  $feedsService.getFeedContact()
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedContact = data;

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed Contact. ";
    });

  // temp
  $scope.feedContact = {
    name: "Steve Tyler",
    title: "Director of Elections",
    phone: "123-456-7890",
    fax: "123-456-0000",
    email: "myemail@domain.com"
  };
}
