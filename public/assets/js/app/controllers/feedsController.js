'use strict';
/*
 * Feeds Controller
 *
 */
function FeedsCtrl($scope, $rootScope, $feedsService, $location, $filter, ngTableParams, $interval, $timeout, $route) {

  // initialize page header variables
  $rootScope.setPageHeader("Feeds", $rootScope.getBreadCrumbs(), "feeds", null);

  // call our services
  $feedsService.getFeeds()
    .success(function (data) {

      for(var i=0; i< data.length; i++){

        // disable the feed link if it's processing
        if(data[i].complete){
          data[i].self = $location.absUrl() + "/" + data[i].id;
        } else {
          data[i].self = "javascript: void(0);";

          // if not failed
          if(!data[i].failed){
            $scope.isProcessing = true;

            var processingTime = moment((data[i]).now).diff(moment(data[i].date_loaded).utc(), "seconds");
            data[i].processingTime = "(" + $rootScope.secondsToClockText(processingTime) + ")";
          }
        }

        // set the due date in days
        if(data[i].date && moment(data[i].date).isValid()){
          data[i].due_in = $rootScope.getDueDateTextDays(data[i].date, data[i].now);
        } else {
          data[i].due_in = "N/A";
        }

      }

      // set the feeds data into the Angular model
      $scope.feeds = data;


      // if any feed is processing
      if($scope.isProcessing){

        // get the processing times
        var stop = $interval(function(){

          // set the processing time clocks for the feeds
          for(var i=0; i< $scope.feeds.length; i++){
            // if feed is not complete
            if(!$scope.feeds[i].complete){
              var processingTime = moment((data[i]).now).diff(moment(data[i].date_loaded).utc(), "seconds");
              $scope.feeds[i].processingTime = "(" + $rootScope.secondsToClockText(processingTime) + ")";
            }
          }
        }, 1000);

        // refresh the page after a min
        $timeout(function(){ $route.reload(); }, 1000 * 60);
      }

      // sets the defaults for the table sorting parameters
      $scope.feedTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, 10, {date: 'asc'});

    }).error(function (data) {

      $rootScope.pageHeader.error = "Could not retrieve Feeds Data.";
    });
}
