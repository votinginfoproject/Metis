'use strict';

function FeedOverview51Ctrl($scope, $routeParams) {
  var publicId = $scope.publicId = $routeParams.vipfeed;

  $scope.pageTitle = formatVipFeedID(publicId);
  $scope.errorReport = "/db/feeds/" + publicId + "/xml/errors/report";
}
