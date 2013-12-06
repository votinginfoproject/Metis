'use strict';
/*
 * Feeds Detail Controller
 *
 */
function FeedsDetailCtrl($scope, $rootScope, $feedsService, $routeParams, $location) {

  // get the vipfeed param from the route
  $scope.vipfeed = $routeParams.vipfeed;

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
  $rootScope.setPageHeader("Feeds", breadcrumbs, "feeds", null);

  // call our service
  $feedsService.getData()
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feeds = data;

    }).error(function (data) {

      $rootScope.pageHeader.error = "Could not retrieve Feeds Data."
    });
}
