function v5AsideController($scope, $rootScope) {
  $rootScope.feedURL = function(path) {
    return "#/5.1/feeds/" + $rootScope.publicId + path;
  };
}
