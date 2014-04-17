'use strict';
/*
 * Feed Electoral District Controller
 *
 */
function FeedElectoralDistrictCtrl($scope, $rootScope, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  // create a unique id for this page based on the breadcrumbs
  $scope.pageId = $rootScope.generatePageId(feedid) + "-single";

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
      FeedElectoralDistrictCtrl_getFeedElectoralDistrict($scope, $rootScope, $feedsService, $rootScope.getServiceUrl($location.path()), $appProperties, $filter, ngTableParams, feedid, electoraldistrictid);

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
 * Get the Feed Electoral District for the Feed detail page
 *
 */
function FeedElectoralDistrictCtrl_getFeedElectoralDistrict($scope, $rootScope, $feedsService, servicePath, $appProperties, $filter, ngTableParams, feedid, electoraldistrictid){

  // get Feed Electoral District
  $feedsService.getFeedElectoralDistrict(servicePath)
    .success(function (data) {

      // use the self property to use as the linked URL for each item
      $rootScope.changeSelfToAngularPath(data.contests);
      $rootScope.changeSelfToAngularPath(data.precincts);
      $rootScope.changeSelfToAngularPath(data.precinctsplits);

        // set the feeds data into the Angular model
      $scope.feedElectoralDistrict = data;

      // set the title
      $rootScope.pageHeader.title = "Electoral District ID: " + data.id;

      $scope.contestsTableParams = $rootScope.createTableParams(ngTableParams, $filter, data.contests, $appProperties.lowPagination, { id: 'asc' });
      $scope.precinctsTableParams = $rootScope.createTableParams(ngTableParams, $filter, data.precincts, $appProperties.lowPagination, { id: 'asc' });
      $scope.precinctSplitsTableParams = $rootScope.createTableParams(ngTableParams, $filter, data.precinctsplits, $appProperties.lowPagination, { id: 'asc' });

    }).error(function (data, $http) {

      if($http===404){
        // feed not found

        $rootScope.pageHeader.alert = "Sorry, Electoral District \"" + electoraldistrictid + "\" could not be found.";
      } else {
        // some other error

        $rootScope.pageHeader.error += "Could not retrieve Feed Electoral District data. ";
      }

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedElectoralDistrict = {};
    });
}