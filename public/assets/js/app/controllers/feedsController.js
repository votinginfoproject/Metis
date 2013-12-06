'use strict';
/*
 * Feeds Controller
 *
 */
function FeedsCtrl($scope, $rootScope, $feedsService) {

  // initialize page header variables
  $rootScope.setPageHeader("Feeds", "Feeds /", "feeds", null);

  // call our service
  $feedsService.getData()
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feeds = data;

    }).error(function (data) {

      $rootScope.pageHeader.error = "Could not retrieve Feeds Data."
    });
}
