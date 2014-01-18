'use strict';
/*
 * Feeds Precinct Controller
 *
 */
function FeedPrecinctStreetsegmentsErrorsCtrl($scope, $rootScope, $feedsService, $routeParams, $location, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  // get the locality param from the route
  var localityid = $routeParams.locality;

  // get the precinct param from the route
  var precinctid = $routeParams.precinct;

  // initialize page header variables
  $rootScope.setPageHeader("Street Segments Errors", $rootScope.getBreadCrumbs(), "feeds", "", null);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // Toggle showing/hiding each error's detail panel
      $scope.toggleError = function(index){

        var obj = jQuery("#errorDetail" + index);

        if(obj.is(":visible")){
          obj.hide();
        } else {
          obj.show();
        }

        /*
        // If toggling with Angular, however the indexes would be incorrect once any kind of sorting is applied to the table
        if($scope["error" + index]){
          $scope["error" + index] = false;
        } else {
          $scope["error" + index] = true;
        }
        */
      }

      // now call the other services to get the rest of the data
      FeedPrecinctCtrl_getFeedStreetSegmentsErrors($scope, $rootScope, $feedsService, $rootScope.getServiceUrl($location.path()), $filter, ngTableParams, feedid, localityid, precinctid);

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
      $scope.errors = {};
    });
}

/*
 * Get the Feed Precinct Street Segments Errors for the Feed detail page
 *
 */
function FeedPrecinctCtrl_getFeedStreetSegmentsErrors($scope, $rootScope, $feedsService, servicePath, $filter, ngTableParams, feedid, localityid, precinctid){

  // get Feed Precinct
  $feedsService.getFeedPrecinctStreetSegmentsErrors(servicePath)
    .success(function (data) {

      if(data!=null && data.length > 0){
        for(var i=0; i< data.length; i++){
          // simple check to see if potentially xml data
          if(data[i].textualReference.charAt(0)=== "<" && data[i].textualReference.charAt(data[i].textualReference.length-1)=== ">"){
            // add indentation
            data[i].textualReference = vkbeautify.xml(data[i].textualReference);
            // also add in a property to mark this to be presented in <pre> and <code> tags
            data[i]._code = true;
          }
        }
      }

      // set the feeds data into the Angular model
      $scope.errors = data;

      $scope.errorsTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, 15, { id: 'asc' });

      // update the title
      $rootScope.pageHeader.title += $scope.errors.length + " Total ";

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Errors data. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.errors = {};
    });
}