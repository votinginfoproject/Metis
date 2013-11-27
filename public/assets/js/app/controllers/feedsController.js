'use strict';
/*
 * Feeds Controller
 *
 */
function FeedsCtrl($scope, $rootScope, $feedsService){

    // initialize page header variables
    $rootScope.setPageHeader("Feeds", ["Feeds"], "feeds", null);

    // call our service
    $feedsService.getData()
        .success(function (data) {

            $scope.data = data;
        }).error(function (data) {

            $rootScope.pageHeader.error = "Could not retrieve Feeds Data."
        });
}
