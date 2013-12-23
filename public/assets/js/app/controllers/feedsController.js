'use strict';
/*
 * Feeds Controller
 *
 */
function FeedsCtrl($scope, $rootScope, $feedsService, $location, $filter, ngTableParams, $cacheFactory) {

  var breadcrumbs = [
    {
      name: "Feeds",
      url: $location.absUrl()
    }
  ];

  // initialize page header variables
  $rootScope.setPageHeader("Feeds", breadcrumbs, "feeds", null);

  // call our services
  $feedsService.getFeeds()
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feeds = data;

      // sets the defaults for the table sorting parameters
      $scope.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
          date: 'asc'
        }
      }, {
        total: data.length,
        // sets the type of sorting for the table
        getData: function ($defer, params) {
          var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });

    }).error(function (data) {

      $rootScope.pageHeader.error = "Could not retrieve Feeds Data.";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feeds = {};
    });
}
