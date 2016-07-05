'use strict';

function FeedOverview51Ctrl($scope, $routeParams) {
  var publicId = $routeParams.vipfeed;
  $scope.publicId = publicId;
  $scope.errorReport = "/db/feeds/" + publicId + "/xml/errors/report";
}
