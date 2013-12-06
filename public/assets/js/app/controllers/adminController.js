'use strict';
/*
 * Admin Controller
 *
 */
function AdminCtrl($scope, $rootScope, $adminService, $location) {

  var breadcrumbs = [
    {
      name: "Admin",
      url: $location.absUrl()
    }
  ];

  // initialize page header variables
  $rootScope.setPageHeader("Admin", breadcrumbs, "admin", null);

  // call our service
  $adminService.getData()
    .success(function (data) {

      $scope.data = data;
    }).error(function (data) {

      $rootScope.pageHeader.error = "Could not retrieve Admin Data."
    });
}
