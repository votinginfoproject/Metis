'use strict';
/*
 * Feeds Controller
 *
 */
function FeedsCtrl($scope, $rootScope, $feedsService, $location, $filter, ngTableParams, $cacheFactory) {

  // initialize page header variables
  $rootScope.setPageHeader("Feeds", $rootScope.getBreadCrumbs(), "feeds", null);

  // call our services
  $feedsService.getFeeds()
    .success(function (data) {

      for(var i=0; i< data.length; i++){
        if(data[i].complete){
          data[i].self = $location.absUrl() + "/" + data[i].id;
        } else {
          data[i].self = "javascript: void(0);";
          $rootScope.pageHeader.alert = "One or more Feeds are processing. Please refresh this page to get an update.";
        }
      }

      // set the feeds data into the Angular model
      $scope.feeds = data;

      // sets the defaults for the table sorting parameters
      $scope.feedTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, 10, {date: 'asc'});

    }).error(function (data) {

      $rootScope.pageHeader.error = "Could not retrieve Feeds Data.";
    });
}
