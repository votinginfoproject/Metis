'use strict';
/*
 * Feeds Controller
 *
 */
function FeedsCtrl($scope, $rootScope, $feedDataPaths, $feedsService, $location, $filter, ngTableParams, $interval, $timeout, $route, $authService, $http) {

  // initialize page header variables
  $rootScope.setPageHeader("Feeds", $rootScope.getBreadCrumbs(), "feeds", null);

  $rootScope.page = 0;

  var getFeedResponse = function() {
    $authService.getUser(function (user){
      console.log("loading feeds for " + user.fipsCodes);
      $feedDataPaths.getResponse(
        {path: "/db/feeds",
         config: {'params': {'page': $rootScope.page}},
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

  function postStopFeed(feedid) {
    if (!$authService.hasRole('super-admin')) {
      $authService.getUser(function (user) {
        console.log("feed stop requested by " + user.userName);
        $http.post('/db/feeds/' + feedid + '/stop', {user_name: user.userName}).
        then(
          function(result) {
            if(result.data.length === 0) {
              $rootScope.pageHeader.alert = "Feed could not be stopped.";
              $rootScope.feedIsStopped = false;
            } else {
              $rootScope.pageHeader.alert = "Stopping the feed processing.";
              $rootScope.feedIsStopped = true;
            }
          },
          function() {
            $rootScope.pageHeader.error = "An error occurred trying to stop this feed.";
            $rootScope.feedIsStopped = false;
          });
        $route.reload();
      })
    } else {
      $rootScope.pageHeader.error = "User is not authorized to stop feeds.";
    }
  }

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

  $rootScope.requestFeedStop = function(feedid) {
    console.log("feed stop requested");

    if(confirm("Are you sure you want to stop this feed?")) {
      postStopFeed(feedid);
      // $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/stop',
      //                              scope: $rootScope,
      //                              key: "feedIsStopped",
      //                              errorMessage: "Could not stop the feed run."},
      //                            function(result) {
      //                              $rootScope.pageHeader.error = "An error occurred trying to stop this feed.";
      //                            });
    };
  };

  getFeedResponse();
}
