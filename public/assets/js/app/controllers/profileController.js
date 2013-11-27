'use strict';
/*
 * Profile Controller
 *
 */
function ProfileCtrl($scope, $rootScope, $profileService) {

    // initialize page header variables
    $rootScope.setPageHeader("Profile", ["Profile"], "profile", null);

    // call our service
    $profileService.getData()
        .success(function (data) {

            $scope.data = data;
        }).error(function (data) {

            $rootScope.pageHeader.error = "Could not retrieve Profile Data."
        });
}
