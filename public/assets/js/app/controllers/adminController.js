'use strict';
/*
 * Admin Controller
 *
 */
function AdminCtrl($scope, $rootScope, $adminService){

    // initialize page header variables
    $rootScope.setPageHeader("Admin", ["Admin"], "admin", null);

    // call our service
    $adminService.getData()
        .success(function (data) {

            $scope.data = data;
        }).error(function (data) {

            $rootScope.pageHeader.error = "Could not retrieve Admin Data."
        });
}
