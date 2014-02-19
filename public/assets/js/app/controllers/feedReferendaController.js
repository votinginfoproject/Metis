/**
 * Created by rcartier13 on 1/29/14.
 */


function FeedReferendaCtrl($scope, $rootScope, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  // initialize page header variables
  $rootScope.setPageHeader("Contests", $rootScope.getBreadCrumbs(), "feeds", "", null);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // now call the other services to get the rest of the data
      FeedReferendaCtrl_getFeedRefereneda($scope, $rootScope, $feedsService, $rootScope.getServiceUrl($location.path()), $appProperties, $filter, ngTableParams);

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
      $scope.feedReferenda = {};
    });
}

function FeedReferendaCtrl_getFeedRefereneda($scope, $rootScope, $feedsService, servicePath, $appProperties, $filter, ngTableParams) {

  $feedsService.getFeedReferenda(servicePath)
    .success(function(data) {

      // set the feeds data into the Angular model
      $scope.feedReferenda = data;

      // sets the defaults for the table sorting parameters
      $scope.referendaTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, $appProperties.highPagination, { id: 'asc' });

      // set the title
      $rootScope.pageHeader.title = $scope.feedReferenda.length + " Referenda";
    }).error(function(data, $http) {
      $rootScope.pageHeader.error += "Could not retrieve Feed Referenda data. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedReferenda = {};
    });
}
