'use strict';
/*
 * Feeds Electoral Districts pages Controller
 *
 */
function FeedElectoralDistrictsCtrl($scope, $rootScope, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  // create a unique id for this page based on the breadcrumbs
  $scope.pageId = $rootScope.generatePageId(feedid);

  // initialize page header variables
  $rootScope.setPageHeader("Electoral Districts", $rootScope.getBreadCrumbs(), "feeds", "", null);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // now call the other services to get the rest of the data
      FeedElectoralDistrictsCtrl_getFeedElectoralDistricts($scope, $rootScope, $feedsService, $rootScope.getServiceUrl($location.path()), $appProperties, $filter, ngTableParams, feedid);

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
      $scope.feedElectoralDistricts = {};
    });

}

/*
 * Get the Feed Electoral Districts for the Feed detail page
 *
 */
function FeedElectoralDistrictsCtrl_getFeedElectoralDistricts($scope, $rootScope, $feedsService, servicePath, $appProperties, $filter, ngTableParams, feedid){

  // get Feed Precincts
  $feedsService.getFeedElectoralDistricts(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedElectoralDistricts = data;

      $scope.electoralDistrictsTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, $appProperties.lowPagination, { id: 'asc' });

    }).error(function (data, $http) {

      $rootScope.pageHeader.error += "Could not retrieve Electoral Districts data. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedElectoralDistricts = {};
    });
}