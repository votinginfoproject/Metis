function v5AsideController($scope, $rootScope, $routeParams) {
  var publicId = $scope.publicId = $routeParams.vipfeed;
  $rootScope.feedURL = function(path) {
    return "#/5.1/feeds/" + $scope.publicId + path;
  };
}
