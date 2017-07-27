'use strict';
/*
 * Feeds Controller
 *
 */
function FeedsCtrl($scope, $rootScope, $feedDataPaths, $feedsService, $location, $filter, ngTableParams, $interval, $timeout, $route, $authService) {
  console.log("at top of FeedsCtrl");
  // initialize page header variables
  $rootScope.setPageHeader("Feeds", $rootScope.getBreadCrumbs(), "feeds", null);

  $rootScope.page = 0;

  var getFeedResponse = function() {
    $authService.getUser(function (user){
      console.log(user);
      $feedDataPaths.getResponse(
        {path: "/db/feeds",
         config: {'params': {'page': $rootScope.page,
                             'fipsCodes': user.fipsCodes}},
         scope: $rootScope,
         key: "feeds",
         errorMessage: "Could not retrieve Feeds."},
        function(result) {
          for (var i = 0; i < result.length; i++) {
            var feed = $rootScope.feeds[i];
            var date = new Date(feed.election_date);
            $rootScope.feeds[i]['due_on'] = date.setDate(date.getDate() - 22);
          }});
    });
  };

  $rootScope.nextPage = function() {
    $rootScope.page = $rootScope.page + 1;

    getFeedResponse();
  };

  $rootScope.previousPage = function() {
    if ($rootScope.page > 0) {
      $rootScope.page = $rootScope.page - 1;
      getFeedResponse();
    }
  };

  getFeedResponse();
}
