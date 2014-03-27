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

        if(data[i].complete){
          // it's complete
          data[i].self = $location.absUrl() + "/" + data[i].id;

          var processingTime = moment((data[i]).date_completed).diff(moment(data[i].date_loaded).utc(), "seconds");

          // if it completed very quick
          if(processingTime ===0){
            processingTime = 1;
          }
          data[i].processingTime = "(" + $rootScope.secondsToClockText(processingTime) + ")";

        } else {
          // disable the feed link if it's processing or failed
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

        // format the loaded_on date
        data[i].date_loaded_formatted = moment(data[i].date_loaded).format("MMM DD, YYYY - h:mm a");
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
            if(!$scope.feeds[i].complete && !$scope.feeds[i].failed){
              var processingTime = moment((data[i]).now).diff(moment(data[i].date_loaded).utc(), "seconds");
              $scope.feeds[i].processingTime = "(" + $rootScope.secondsToClockText(processingTime) + ")";
            }
          }
        }, 1000);

        // refresh the page after a min
        $rootScope.refreshTimer = $timeout(function(){ window.location.href="/"; }, 1000 * 60);

      }

      // sets the defaults for the table sorting parameters
      // sort by date_loaded, descending order
      $scope.feedTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, 10, {date_loaded: 'des'});

    }).error(function (data) {

      $rootScope.pageHeader.error = "Could not retrieve Feeds Data.";
    });
}
