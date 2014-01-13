'use strict';
/*
 * Feeds PrecinctSplits Controller
 *
 */
function FeedPrecinctSplitsCtrl($scope, $rootScope, $feedsService, $routeParams, $location, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  // get the locality param from the route
  var localityid = $routeParams.locality;

  // get the precinct param from the route
  var precinctid = $routeParams.precinct;

  var breadcrumbs = [
    {
      name: "Feeds",
      url: "/#/feeds"
    },
    {
      name: feedid,
      url: "/#/feeds/" + $scope.vipfeed
    },
    {
      name: "Election",
      url: "/#/feeds/" + $scope.vipfeed + "/election"
    },
    {
      name: "State",
      url: "/#/feeds/" + $scope.vipfeed + "/election/state"
    },
    {
      name: "Localities",
      url: "/#/feeds/" + $scope.vipfeed + "/election/state/localities"
    },
    {
      name: localityid,
      url: "/#/feeds/" + $scope.vipfeed + "/election/state/localities/" + localityid
    },
    {
      name: "Precincts",
      url: "/#/feeds/" + $scope.vipfeed + "/election/state/localities/" + localityid + "/precincts"
    },
    {
      name: precinctid,
      url: "/#/feeds/" + $scope.vipfeed + "/election/state/localities/" + localityid + "/precincts/" + precinctid
    },
    {
      name: "Precinct Splits",
      url: $location.absUrl()
    }
  ];

  // initialize page header variables
  $rootScope.setPageHeader("Precinct Splits", breadcrumbs, "feeds", "", null);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // now call the other services to get the rest of the data
      //FeedPrecinctCtrl_getFeedPrecinct($scope, $rootScope, $feedsService, $rootScope.getServiceUrl($location.path()), $filter, ngTableParams, precinctid, feedid, localityid);

    }).error(function (data, $http) {

      if($http===404){
        // feed not found

        $rootScope.pageHeader.alert = "Sorry, the VIP feed \"" + feedid + "\" does not exist.";
      } else {
        // some other error

        $rootScope.pageHeader.error += "Could not retrieve Feed data. ";
      }

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedData = {};
      $scope.feedPrecinctSplits = {};
    });
}
