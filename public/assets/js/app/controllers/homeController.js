'use strict';
/*
 * Home Controller
 *
 */
function HomeCtrl($scope, $rootScope, $homeService, $routeParams){

    // initialize page header variables
    $rootScope.setPageHeader("Welcome", "Home /", "home", null);

    if($routeParams.badlogin){
        $rootScope.pageHeader.error = "Bad Username or Password."
    }

    /*
    // call our service
    $homeService.getData()
        .success(function (data) {

            $scope.data = data;
        }).error(function (data) {

            $rootScope.pageHeader.error = "Could not retrieve Home Data."
        });
    */
}
