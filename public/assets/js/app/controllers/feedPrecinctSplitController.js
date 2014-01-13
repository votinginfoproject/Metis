'use strict';
/*
 * Feeds PrecinctSplit Controller
 *
 */
function FeedPrecinctSplitCtrl($scope, $rootScope, $feedsService, $routeParams, $location, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  // get the locality param from the route
  var localityid = $routeParams.locality;

  // get the precinct param from the route
  var precinctid = $routeParams.precinct;

  // get the precinctsplit param from the route
  var precinctsplitid = $routeParams.precinctsplit;

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
      url: "/#/feeds/" + $scope.vipfeed + "/election/state/localities/" + localityid + "/precincts/" + precinctid + "/precinctsplits"
    },
    {
      name: precinctsplitid,
      url: $location.absUrl()
    }
  ];

  // initialize page header variables
  $rootScope.setPageHeader("Precinct Split", breadcrumbs, "feeds", "", null);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // now call the other services to get the rest of the data
      FeedPrecinctSplitCtrl_getFeedPrecinctSplit($scope, $rootScope, $feedsService, $rootScope.getServiceUrl($location.path()), $filter, ngTableParams, precinctsplitid, precinctid, feedid, localityid);

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
      $scope.feedPrecinctSplit = {};
      $scope.feedElectoralDistricts = {};
      $scope.feedPollingLocations = {};
      $scope.feedStreetSegments = {};
    });

}

/*
 * Get the Feed PrecinctSplit for the Feed detail page
 *
 */
function FeedPrecinctSplitCtrl_getFeedPrecinctSplit($scope, $rootScope, $feedsService, servicePath, $filter, ngTableParams, precinctsplitid, precinctid, feedid, localityid){

  // get Feed Precinct Split
  $feedsService.getFeedPrecinctSplit(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedPrecinctSplit = data;

      // set the title
      $rootScope.pageHeader.title = "Precinct Split ID: " + data.id;

      // now call the other services to get the rest of the data
      FeedPrecinctSplitCtrl_getFeedElectoralDistricts($scope, $rootScope, $feedsService, data.electoral_districts, $filter, ngTableParams);
      FeedPrecinctSplitCtrl_getFeedPollingLocations($scope, $rootScope, $feedsService, data.polling_locations, $filter, ngTableParams);

    }).error(function (data, $http) {

      if($http===404){
        // feed not found

        $rootScope.pageHeader.alert = "Sorry, Precinct Split  \"" + precinctsplitid + "\" of Precinct  \"" + precinctid + "\" for Locality  \"" + localityid + "\" under VIP feed \"" + feedid + "\" does not exist.";
      } else {
        // some other error

        $rootScope.pageHeader.error += "Could not retrieve Feed Precinct Split data. ";
      }

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedPrecinctSplit = {};
      $scope.feedElectoralDistricts = {};
      $scope.feedPollingLocations = {};
      $scope.feedStreetSegments = {};

    });
}

/*
 * Get the Feed Precinct Split Electoral Districts for the Feed detail page
 *
 */
function FeedPrecinctSplitCtrl_getFeedElectoralDistricts($scope, $rootScope, $feedsService, servicePath, $filter, ngTableParams){

  // get Feed Electoral Districts
  $feedsService.getFeedPrecinctSplitElectoralDistricts(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedElectoralDistricts = data;

      $scope.electoralDistrictsTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, 15, { id: 'asc' });

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Precinct Split Electoral Districts. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedElectoralDistricts = {};
    });
}

/*
 * Get the Feed Precinct Split Polling Locations for the Feed detail page
 *
 */
function FeedPrecinctSplitCtrl_getFeedPollingLocations($scope, $rootScope, $feedsService, servicePath, $filter, ngTableParams){

  // get Feed Early Vote Sites
  $feedsService.getFeedPrecinctSplitPollingLocations(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedPollingLocations = data;

      $scope.pollingLocationsTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, 15, { id: 'asc' });

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Precinct Split Polling Locations. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedPollingLocations = {};
    });
}