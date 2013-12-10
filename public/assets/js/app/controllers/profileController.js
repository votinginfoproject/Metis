'use strict';
/*
 * Profile Controller
 *
 */
function ProfileCtrl($scope, $rootScope, $profileService, $location) {

  var breadcrumbs = [
    {
      name: "Profile",
      url: $location.absUrl()
    }
  ];

  // initialize page header variables
  $rootScope.setPageHeader("Profile", breadcrumbs, "profile", null);

  // call our service
  $profileService.getData()
    .success(function (data) {

      $scope.data = data;
    }).error(function (data) {

      $rootScope.pageHeader.error = "Could not retrieve Profile Data.";
    });
}
