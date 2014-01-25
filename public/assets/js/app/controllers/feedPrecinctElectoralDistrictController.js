'use strict';
/*
 * Feeds Precinct Electoral District Controller
 *
 */
function FeedPrecinctElectoralDistrictCtrl($scope, $rootScope, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  // get the locality param from the route
  var localityid = $routeParams.locality;

  // get the precinct param from the route
  var precinctid = $routeParams.precinct;

  // get the electoral district param from the route
  var electoraldistrictid = $routeParams.districtid;

  // initialize page header variables
  $rootScope.setPageHeader("Electoral District", $rootScope.getBreadCrumbs(), "feeds", "", null);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // now call the other services to get the rest of the data
      FeedPrecinctElectoralDistrictCtrl_getFeedElectoralDistrict($scope, $rootScope, $feedsService, $rootScope.getServiceUrl($location.path()), $appProperties, $filter, ngTableParams, feedid, localityid, precinctid, electoraldistrictid);

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
      $scope.feedElectoralDistrict = {};
      $scope.feedContests = {};
      $scope.feedPrecincts = {};
      $scope.feedPrecinctSplits = {};
    });
}

/*
 * Get the Feed Precinct Electoral District for the Feed detail page
 *
 */
function FeedPrecinctElectoralDistrictCtrl_getFeedElectoralDistrict($scope, $rootScope, $feedsService, servicePath, $appProperties, $filter, ngTableParams, feedid, localityid, precinctid, electoraldistrictid){

  // get Feed Precinct
  $feedsService.getFeedPrecinctElectoralDistrict(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedElectoralDistrict = data;

      // set the title
      $rootScope.pageHeader.title = "Electoral District ID: " + data.id;

      // now call the other services to get the rest of the data
      FeedPrecinctElectoralDistrictCtrl_getFeedContests($scope, $rootScope, $feedsService, data.contests, $appProperties, $filter, ngTableParams);
      FeedPrecinctElectoralDistrictCtrl_getFeedPrecincts($scope, $rootScope, $feedsService, data.precincts, $appProperties, $filter, ngTableParams);
      FeedPrecinctElectoralDistrictCtrl_getFeedPrecinctSplits($scope, $rootScope, $feedsService, data.precinctsplits, $appProperties, $filter, ngTableParams);

    }).error(function (data, $http) {

      if($http===404){
        // feed not found

        $rootScope.pageHeader.alert = "Sorry, Electoral District \"" + electoraldistrictid + "\" of Precinct  \"" + precinctid + "\" for Locality  \"" + localityid + "\" under VIP feed \"" + feedid + "\" does not exist.";
      } else {
        // some other error

        $rootScope.pageHeader.error += "Could not retrieve Feed Precinct Electoral District data. ";
      }

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedElectoralDistrict = {};
      $scope.feedContests = {};
      $scope.feedPrecincts = {};
      $scope.feedPrecinctSplits = {};
    });
}

/*
 * Get the Feed Precinct Electoral District Contests for the Feed detail page
 *
 */
function FeedPrecinctElectoralDistrictCtrl_getFeedContests($scope, $rootScope, $feedsService, servicePath, $appProperties, $filter, ngTableParams){

  // get Feed Contests
  $feedsService.getFeedPrecinctElectoralDistrictContests(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedContests = data;

      $scope.contestsTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, $appProperties.lowPagination, { id: 'asc' });

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Precinct Electoral District Contests. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedContests = {};
    });
}

/*
 * Get the Feed Precinct Electoral District Precincts for the Feed detail page
 *
 */
function FeedPrecinctElectoralDistrictCtrl_getFeedPrecincts($scope, $rootScope, $feedsService, servicePath, $appProperties, $filter, ngTableParams){

  // get Feed Precincts
  $feedsService.getFeedPrecinctElectoralDistrictPrecincts(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedPrecincts = data;

      $scope.precinctsTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, $appProperties.lowPagination, { id: 'asc' });

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Precinct Electoral District Precincts. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedPrecincts = {};
    });
}

/*
 * Get the Feed Precinct Electoral District PrecinctSplits for the Feed detail page
 *
 */
function FeedPrecinctElectoralDistrictCtrl_getFeedPrecinctSplits($scope, $rootScope, $feedsService, servicePath, $appProperties, $filter, ngTableParams){

  // get Feed Precincts
  $feedsService.getFeedPrecinctElectoralDistrictPrecinctSplits(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedPrecinctSplits = data;

      $scope.precinctSplitsTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, $appProperties.lowPagination, { id: 'asc' });

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Precinct Electoral District Precinct Splits. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedPrecinctSplits = {};
    });
}