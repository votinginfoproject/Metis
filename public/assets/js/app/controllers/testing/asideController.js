'use strict';
function TestingAsideCtrl($scope, $rootScope, $authService, $location) {

  if (!$authService.isAuthenticated()) {
    $location.url('/');
  }
}
