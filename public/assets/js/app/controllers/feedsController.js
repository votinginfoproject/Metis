'use strict';
/*
 * Feeds Controller
 *
 */
function FeedsCtrl($scope, $rootScope, $feedsService, $location, $filter, ngTableParams) {

  var breadcrumbs = [
    {
      name: "Feeds",
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

      $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        sorting: {
          date: 'asc'     // initial sorting
        }
      }, {
        total: data.length, // length of data
        getData: function($defer, params) {
          // use build-in angular filter
          var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });

    }).error(function (data) {

      $rootScope.pageHeader.error = "Could not retrieve Feeds Data."
    });
}
