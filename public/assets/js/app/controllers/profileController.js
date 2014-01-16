'use strict';
/*
 * Profile Controller
 *
 */
function ProfileCtrl($scope, $rootScope, $profileService, $location) {

  // initialize page header variables
  $rootScope.setPageHeader("Profile", $rootScope.getBreadCrumbs(), "profile", null, null);

  // call our service
  $profileService.getData()
    .success(function (data) {

      $scope.data = data;
    }).error(function (data) {

      $rootScope.pageHeader.error = "Could not retrieve Profile Data.";
    });
}
