'use strict';
/*
 * Profile Controller
 *
 */
function ProfileCtrl($scope, $rootScope, $route, $location, $dasherService, $authService) {

	// initialize page header variables
  $rootScope.setPageHeader("Profile", $rootScope.getBreadCrumbs(), "profile", null);

  //if we end up here and we're not authenticated, move on to /login
  if(!$authService.isAuthenticated()) {
    $location.url("/login");
  }

	$authService.getUser(function (user){
		$scope.userId = user["id"];
		$scope.apiKey = user["apiKey"];
	});

	$scope.generateApiKey = function(){
		$dasherService.generateApiKey($scope.apiKey);
	};
}
