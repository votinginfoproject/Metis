'use strict';
/*
 * VIP App
 *
 */

// ========================================================================
// Comment in if want to disable all "debug" logging via the debug() method
// ========================================================================
//debug.setLevel(0);
// ========================================================================

// VIP app module with its dependencies
var vipApp = angular.module('vipApp', ['ngTable', 'ngRoute', 'ngCookies']);

// Constants - will be added to with the properties from the external properties files
// "vip.properties" and "map.properties"
// the properties that should not be configurable will be placed here beforehand
vipApp.constant('$appProperties', {
  contextRoot: '',
  servicesPath: '/services'
});


/*
 * VIP App configuration
 *
 * Will setup routing and retrieve reference data for the app before any pages are loaded
 *
 */
vipApp.config(['$routeProvider', '$appProperties', '$httpProvider', '$logProvider',
  function ($routeProvider, $appProperties, $httpProvider, $logProvider) {

    // disable the logProvider's debugging as Ngtable uses it and it crowds out all other logging
    // without any other way to turn it off
    $logProvider.debugEnabled(false);

    $routeProvider.when('/', {
      templateUrl: $appProperties.contextRoot + '/app/partials/home.html',
      controller: 'HomeCtrl'
    });

    $routeProvider.when('/feeds', {
      templateUrl: $appProperties.contextRoot + '/app/partials/feeds.html',
      controller: 'FeedsCtrl'
    });

    $routeProvider.when('/feeds/:vipfeed', {
      templateUrl: $appProperties.contextRoot + '/app/partials/feed-overview.html',
      controller: 'FeedOverviewCtrl'
    });

    $routeProvider.when('/feeds/:vipfeed/source', {
      templateUrl: $appProperties.contextRoot + '/app/partials/feed-source.html',
      controller: 'FeedSourceCtrl'
    });

    $routeProvider.when('/feeds/:vipfeed/election', {
      templateUrl: $appProperties.contextRoot + '/app/partials/feed-election.html',
      controller: 'FeedElectionCtrl'
    });

    $routeProvider.when('/feeds/:vipfeed/election/results', {
      templateUrl: $appProperties.contextRoot + '/app/partials/feed-results.html',
      controller: 'FeedResultsCtrl'
    });

    $routeProvider.when('/feeds/:vipfeed/election/contests', {
      templateUrl: $appProperties.contextRoot + '/app/partials/feed-contests.html',
      controller: 'FeedContestsCtrl'
    });

    $routeProvider.when('/feeds/:vipfeed/election/contests/:contest', {
      templateUrl: $appProperties.contextRoot + '/app/partials/feed-contest.html',
      controller: 'FeedContestCtrl'
    });

    $routeProvider.when('/feeds/:vipfeed/election/contests/:contest/ballotlineresults', {
      templateUrl: $appProperties.contextRoot + '/app/partials/feed-ballotlineresults.html',
      controller: 'FeedBallotLineResultsCtrl'
    });

    $routeProvider.when('/feeds/:vipfeed/election/contests/:contest/ballotlineresults/:ballotlineresult', {
      templateUrl: $appProperties.contextRoot + '/app/partials/feed-ballotlineresult.html',
      controller: 'FeedBallotLineResultCtrl'
    });

    $routeProvider.when('/feeds/:vipfeed/election/contests/:contest/contestresult', {
      templateUrl: $appProperties.contextRoot + '/app/partials/feed-contestresult.html',
      controller: 'FeedContestResultCtrl'
    });

    $routeProvider.when('/feeds/:vipfeed/election/contests/:contest/ballot', {
      templateUrl: $appProperties.contextRoot + '/app/partials/feed-ballot.html',
      controller: 'FeedBallotCtrl'
    });

    $routeProvider.when('/feeds/:vipfeed/election/contests/:contest/ballot/candidates', {
      templateUrl: $appProperties.contextRoot + '/app/partials/feed-candidates.html',
      controller: 'FeedCandidatesCtrl'
    });

    $routeProvider.when('/feeds/:vipfeed/election/contests/:contest/ballot/candidates/:candidate', {
      templateUrl: $appProperties.contextRoot + '/app/partials/feed-candidate.html',
      controller: 'FeedCandidateCtrl'
    });

    $routeProvider.when('/feeds/:vipfeed/election/contests/:contest/ballot/referenda', {
      templateUrl: $appProperties.contextRoot + '/app/partials/feed-referenda.html',
      controller: 'FeedReferendaCtrl'
    });

    $routeProvider.when('/feeds/:vipfeed/election/contests/:contest/ballot/referenda/:referendum', {
      templateUrl: $appProperties.contextRoot + '/app/partials/feed-referendum.html',
      controller: 'FeedReferendumCtrl'
    });

    $routeProvider.when('/feeds/:vipfeed/election/state', {
      templateUrl: $appProperties.contextRoot + '/app/partials/feed-state.html',
      controller: 'FeedStateCtrl'
    });

    $routeProvider.when('/feeds/:vipfeed/election/state/localities', {
      templateUrl: $appProperties.contextRoot + '/app/partials/feed-localities.html',
      controller: 'FeedLocalitiesCtrl'
    });

    $routeProvider.when('/feeds/:vipfeed/election/state/localities/:locality', {
      templateUrl: $appProperties.contextRoot + '/app/partials/feed-locality.html',
      controller: 'FeedLocalityCtrl'
    });

    // for all election administration pages
    $routeProvider
      .when('/feeds/:vipfeed/election/state/electionadministration', { templateUrl: $appProperties.contextRoot + '/app/partials/feed-electionadministration.html', controller: 'FeedElectionAdministrationCtrl' })
      .when('/feeds/:vipfeed/election/state/localities/:locality/electionadministration', { templateUrl: $appProperties.contextRoot + '/app/partials/feed-electionadministration.html', controller: 'FeedElectionAdministrationCtrl' });

    $routeProvider.when('/feeds/:vipfeed/election/state/localities/:locality/precincts', {
      templateUrl: $appProperties.contextRoot + '/app/partials/feed-precincts.html',
      controller: 'FeedPrecinctsCtrl'
    });

    $routeProvider.when('/feeds/:vipfeed/election/state/localities/:locality/precincts/:precinct', {
      templateUrl: $appProperties.contextRoot + '/app/partials/feed-precinct.html',
      controller: 'FeedPrecinctCtrl'
    });

    // all polling location pages can now go to the same html partial and the same angular controller
    $routeProvider
      .when('/feeds/:vipfeed/election/state/localities/:locality/precincts/:precinct/pollinglocations/:pollinglocation', { templateUrl: $appProperties.contextRoot + '/app/partials/feed-pollinglocation.html', controller: 'FeedPollingLocationCtrl' })
      .when('/feeds/:vipfeed/election/state/localities/:locality/precincts/:precinct/pollinglocations', { templateUrl: $appProperties.contextRoot + '/app/partials/feed-pollinglocations.html', controller: 'FeedPollingLocationsCtrl' });

    // all polling locations pages can now go to the same html partial and the same angular controller
    $routeProvider
      .when('/feeds/:vipfeed/election/state/localities/:locality/precincts/:precinct/precinctsplits/:precinctsplit/pollinglocations/:pollinglocation', { templateUrl: $appProperties.contextRoot + '/app/partials/feed-pollinglocation.html', controller: 'FeedPollingLocationCtrl' })
      .when('/feeds/:vipfeed/election/state/localities/:locality/precincts/:precinct/precinctsplits/:precinctsplit/pollinglocations', { templateUrl: $appProperties.contextRoot + '/app/partials/feed-pollinglocations.html', controller: 'FeedPollingLocationsCtrl' });

    // all early vote site pages can now go to the same html partial and the same angular controller
    $routeProvider
      .when('/feeds/:vipfeed/election/state/earlyvotesites/:earlyvotesite', { templateUrl: $appProperties.contextRoot + '/app/partials/feed-earlyvotesite.html', controller: 'FeedEarlyVoteSiteCtrl' })
      .when('/feeds/:vipfeed/election/state/localities/:locality/earlyvotesites/:earlyvotesite', { templateUrl: $appProperties.contextRoot + '/app/partials/feed-earlyvotesite.html', controller: 'FeedEarlyVoteSiteCtrl' })
      .when('/feeds/:vipfeed/election/state/localities/:locality/precincts/:precinct/earlyvotesites/:earlyvotesite', { templateUrl: $appProperties.contextRoot + '/app/partials/feed-earlyvotesite.html', controller: 'FeedEarlyVoteSiteCtrl' });

    // all early vote sites pages can now go to the same html partial and the same angular controller
    $routeProvider
      .when('/feeds/:vipfeed/election/state/earlyvotesites', { templateUrl: $appProperties.contextRoot + '/app/partials/feed-earlyvotesites.html', controller: 'FeedEarlyVoteSitesCtrl' })
      .when('/feeds/:vipfeed/election/state/localities/:locality/earlyvotesites', { templateUrl: $appProperties.contextRoot + '/app/partials/feed-earlyvotesites.html', controller: 'FeedEarlyVoteSitesCtrl' })
      .when('/feeds/:vipfeed/election/state/localities/:locality/precincts/:precinct/earlyvotesites', { templateUrl: $appProperties.contextRoot + '/app/partials/feed-earlyvotesites.html', controller: 'FeedEarlyVoteSitesCtrl' });

    // all electoral district pages can now go to the same html partial and the same angular controller
    $routeProvider
      .when('/feeds/:vipfeed/election/state/localities/:locality/precincts/:precinct/electoraldistricts/:electoraldistrict', { templateUrl: $appProperties.contextRoot + '/app/partials/feed-electoraldistrict.html', controller: 'FeedElectoralDistrictCtrl' })
      .when('/feeds/:vipfeed/election/state/localities/:locality/precincts/:precinct/precinctsplits/:precinctsplit/electoraldistricts/:electoraldistrict', { templateUrl: $appProperties.contextRoot + '/app/partials/feed-electoraldistrict.html', controller: 'FeedElectoralDistrictCtrl' })
      .when('/feeds/:vipfeed/election/contests/:contest/electoraldistrict', { templateUrl: $appProperties.contextRoot + '/app/partials/feed-electoraldistrict.html', controller: 'FeedElectoralDistrictCtrl' });

    // all electoral districts pages can now go to the same html partial and the same angular controller
    $routeProvider
      .when('/feeds/:vipfeed/election/state/localities/:locality/precincts/:precinct/electoraldistricts', { templateUrl: $appProperties.contextRoot + '/app/partials/feed-electoraldistricts.html', controller: 'FeedElectoralDistrictsCtrl' })
      .when('/feeds/:vipfeed/election/state/localities/:locality/precincts/:precinct/precinctsplits/:precinctsplit/electoraldistricts', { templateUrl: $appProperties.contextRoot + '/app/partials/feed-electoraldistricts.html', controller: 'FeedElectoralDistrictsCtrl' });

    $routeProvider.when('/feeds/:vipfeed/election/state/localities/:locality/precincts/:precinct/precinctsplits', {
      templateUrl: $appProperties.contextRoot + '/app/partials/feed-precinctsplits.html',
      controller: 'FeedPrecinctSplitsCtrl'
    });

    $routeProvider.when('/feeds/:vipfeed/election/state/localities/:locality/precincts/:precinct/precinctsplits/:precinctsplit', {
      templateUrl: $appProperties.contextRoot + '/app/partials/feed-precinctsplit.html',
      controller: 'FeedPrecinctSplitCtrl'
    });

    // all errors can now go to the same html partial and the same angular controller
    var error = { templateUrl: $appProperties.contextRoot + '/app/partials/feed-errors.html', controller: 'FeedErrorsCtrl' };
    $routeProvider
      .when('/feeds/:vipfeed/source/errors', error)
      .when('/feeds/:vipfeed/errors', error)
      .when('/feeds/:vipfeed/election/state/localities/:locality/precincts/:precinct/streetsegments/errors', error)
      .when('/feeds/:vipfeed/election/state/localities/:locality/precincts/:precinct/precinctsplits/:precinctsplit/streetsegments/errors', error)
      .when('/feeds/:vipfeed/election/contests/:contest/errors', error)
      .when('/feeds/:vipfeed/election/contests/:contest/contestresult/errors', error)
      .when('/feeds/:vipfeed/election/contests/:contest/ballotlineresults/:ballotlineresult/errors', error)
      .when('/feeds/:vipfeed/election/contests/:contest/ballot/candidates/:candidate/errors', error)
      .when('/feeds/:vipfeed/election/contest/:contest/ballot/referenda/:referendum/errors', error)
      .when('/feeds/:vipfeed/election/state/errors', error)
      .when('/feeds/:vipfeed/election/state/localities/:locality/errors', error)
      .when('/feeds/:vipfeed/election/state/electionadministration/errors', error)
      .when('/feeds/:vipfeed/election/state/localities/:locality/electionadministration/errors', error)
      .when('/feeds/:vipfeed/election/state/localities/:locality/precincts/:precinct/errors', error)
      .when('/feeds/:vipfeed/election/state/earlyvotesites/:earlyvotesite/errors', error)
      .when('/feeds/:vipfeed/election/state/localities/:locality/earlyvotesites/:earlyvotesite/errors', error)
      .when('/feeds/:vipfeed/election/state/localities/:locality/precincts/:precinct/pollinglocations/:pollinglocations/errors', error)
      .when('/feeds/:vipfeed/election/state/localities/:locality/precincts/:precinct/earlyvotesites/:earlyvotesite/errors', error)
      .when('/feeds/:vipfeed/election/state/localities/:locality/precincts/:precinct/electoraldistricts/:electoraldistrict/errors', error)
      .when('/feeds/:vipfeed/election/state/localities/:locality/precincts/:precinct/precinctsplits/:precinctsplit/electoraldistricts/:electoraldistrict/errors', error)
      .when('/feeds/:vipfeed/election/state/localities/:locality/precincts/:precinct/precinctsplits/:precinctsplit/pollinglocations/:pollinglocations/errors', error)
      .when('/feeds/:vipfeed/election/contests/:contest/electoraldistrict/errors', error)
      .when('/feeds/:vipfeed/election/state/localities/:locality/precincts/:precinct/precinctsplits/:precinctsplit/errors', error)
      .when('/feeds/:vipfeed/election/errors', error)
      .when('/feeds/:vipfeed/election/contests/:contest/ballot/errors', error)
      .when('/feeds/:vipfeed/election/contests/:contest/ballot/referenda/:referendum/errors', error)
      .when('/feeds/:vipfeed/election/state/earlyvotesites/:earlyvotesite/errors', error)
      .when('/feeds/:vipfeed/election/state/localities/:locality/earlyvotesites/:earlyvotesite/errors', error)
      .when('/feeds/:vipfeed/election/state/localities/:locality/precincts/:precinct/earlyvotesites/:earlyvotesite/errors', error)
      .when('/feeds/:vipfeed/election/contests/:contest/ballot/customballot/errors', error)
      .when('/feeds/:vipfeed/election/contests/:contest/ballot/ballotresponses/errors', error)
      .when('/feeds/:vipfeed/election/contests/:contest/ballot/referenda/:referendum/ballotresponses/errors', error);

    // default when no path specified
    $routeProvider.otherwise({redirectTo: '/'});

    /*
     * HTTP Interceptor
     * Will be used to check to see if user is authenticated
     */
    $httpProvider.responseInterceptors.push(function ($q, $location, $rootScope) {
      return function (promise) {
        return promise.then(
          // Success: just return the response
          function (response) {

            // if the user is logged in and going to the home page,
            // redirect to the feeds page
            if ($rootScope.user !== null && $rootScope.user.isAuthenticated === true && $location.path() === "/") {

              $location.url('/feeds');
            }

            return response;
          },
          // Error: check the error status for 401
          // and if so redirect back to homepage
          function (response) {
            if (response.status === 401) {

              // nullify the user object
              $rootScope.user = null;
              $location.url('/');
            }
            return $q.reject(response);
          });
      }
    });

  }
]);

/*
 * Static initialization block
 *
 * Runs after the vipApp.config block above.
 *
 */
vipApp.run(function ($rootScope, $appService, $location, $httpBackend, $appProperties, $window, $anchorScroll, $http, $timeout) {

  // read the properties file from the server "vip.properties"
  $http.get('vip.properties').then(function (response) {
    vipApp_ns.parseAndAddProperties(response.data, $appProperties);

    $rootScope.getDueDateText = function(date){

      if(date){
        var dueDate = moment(date, "YYYY-MM-DD").subtract($rootScope.$appProperties.electionDueDateWeeksInAdvance, 'weeks');
        var dueDateText = moment(dueDate).utc().format('YYYY-MM-DD');
        return dueDateText;
      } else {
        return "N/A";
      }

    }

    $rootScope.getDueDateTextDays = function(date, now){

      var dueIn = "N/A"
      if(date){
        var dueDate = moment(date, "YYYY-MM-DD").subtract($rootScope.$appProperties.electionDueDateWeeksInAdvance, 'weeks');
        var nowDate = moment(now).utc().format('YYYY-MM-DD');
        dueIn = dueDate.diff(nowDate, 'days');

        if(dueIn < 0){
          dueIn = Math.abs(dueIn) + " days ago";
        } else {
          dueIn = dueIn + " days";
        }
      }

      return dueIn;
    }

    $rootScope.getLoadingTime = function(date){

      var dueIn = "N/A"
      if(date){
        var dueDate = moment(date, "YYYY-MM-DD").subtract($rootScope.$appProperties.electionDueDateWeeksInAdvance, 'weeks');
        var nowDate = moment(now).utc();
        dueIn = dueDate.diff(nowDate, 'days');

        if(dueIn < 0){
          dueIn = Math.abs(dueIn) + " days ago";
        } else {
          dueIn = dueIn + " days";
        }
      }

      return dueIn;
    }

    $rootScope.secondsToClockText = function(totalSec){

      var hours = parseInt( totalSec / 3600 ) % 24;
      var minutes = parseInt( totalSec / 60 ) % 60;
      if(minutes<10){
        minutes = "0" + minutes;
      }
      var seconds = totalSec % 60;
      if(seconds<10){
        seconds = "0" + seconds;
      }

      return hours + ":" + minutes + ":" + seconds;
    }

    $rootScope.forgotPasswordEmail = $rootScope.$appProperties.forgotPasswordEmail;

  });

  // read the properties file from the server "map.properties"
  $http.get('map.properties').then(function (response) {
    vipApp_ns.parseAndAddProperties(response.data, $appProperties);
  });

  $rootScope.$appProperties = $appProperties;

  /*
   * Initialize variables for the app
   */
  $rootScope.pageHeader = {};
  $rootScope.user = null;

  /*
   * When the route is changed scroll to the top of the page
   */
  $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
    $anchorScroll();

    // cancel any refresh timers used on the feed page when processing feeds
    $timeout.cancel($rootScope.refreshTimer);
  });

  /*
   * Expose the $location into the scope
   */
  $rootScope.$location = $location;

  /*
   * Sets PageHeader values
   *
   * @param title - the Title of the page
   * @breadcrumbs - the breadcrumbs as an array
   * @section - section name used for the navigation bar "home", "admin", "feeds", "profile"
   * @error - error message to show on the screen
   * @error - alert message to show on the screen
   */
  $rootScope.setPageHeader = function (title, breadcrumbs, section, error, alert) {

    this.pageHeader.title = title;
    this.pageHeader.section = section;
    this.pageHeader.breadcrumbs = breadcrumbs;
    this.pageHeader.error = error;
    this.pageHeader.alert = alert;
  };

  /*
   * Before we render any pages, see if user is authenticated or not and take appropriate action
   */
  $appService.getUser()
    .success(function (data) {

      // set user object
      $rootScope.user = data;

      // redirect to home page if not authenticated
      if (data ===null || data.isAuthenticated === false) {
        $location.path("/");
      }

    }).error(function (data) {

      // if we get an error, we could not connect to the server to check to
      // see if the user is authenticated, this should not happen
      $rootScope.pageHeader.error = "Server Error";
      $location.path("/");
    });

  /*
   * Set a flag to determine if the screen is in mobile dimensions
   */
  var mobileThreshhold = 1116;
  $rootScope.mobileDimensions = ($window.innerWidth < mobileThreshhold);
  $rootScope.toggleAside = true;

  /*
   * When the window is resized manage the show/hiding of the aside
   */
  window.onresize = function(){

    $rootScope.mobileDimensions = ($window.innerWidth < mobileThreshhold);
    if(!$rootScope.mobileDimensions){

      $rootScope.toggleAside = true;
    }
    $rootScope.$apply();
  }

  /*
   * Independent toggle the aside - used with a onclick event
   */
  $rootScope.toggleAsideFunc = function(){
    if($rootScope.mobileDimensions){
      $rootScope.toggleAside = !$rootScope.toggleAside;
    }
  }

  /*
   * Reusable function for setting up Table Params for NGTable
   */
  $rootScope.createTableParams = function(ngTableParams, $filter, data, count, sorting) {
    // sets the defaults for the table sorting parameters
    return new ngTableParams({
      page: 1,
      count: count,
      sorting: sorting
    }, {
      total: data.length,
      // sets the type of sorting for the table
      getData: function ($defer, params) {
        var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });
  };

  /*
   * Takes a URL path and turns it into a service path used to get the data for the current page
   */
  $rootScope.getServiceUrl = function(urlPath){
    return "/services" + urlPath;
  }

  /*
   * Turns a service URL into the equeivlant Angular path
   */
  $rootScope.getAngularUrl = function(urlPath){
    if(urlPath !== undefined && urlPath !== null){
      urlPath = urlPath.replace("/services/","/#/")
    }

    return urlPath;
  }

  /*
   * Turns an array that has a "self" property and changes the values to be the AngularPath equeivlant
   */
  $rootScope.changeSelfToAngularPath = function(arr){
    for(var i=0; i< arr.length; i++){
      arr[i].self = $rootScope.getAngularUrl(arr[i].self);
    }
  }

  /*
   * Creates the breadcrumbs for the current URL
   *
   * Breadcrumb generation is based on a set of determined URL paths:
   *
   * /feeds/<FEEDID>/source
   * /feeds/<FEEDID>/election/state/localities/<LOCALITYID>/precincts/<PRECINCTID>/precinctsplits/<PRECINCTSPLITID>
   *
   */
  $rootScope.getBreadCrumbs = function(){
    var breadcrumbs = [];

    var path = $location.path();
    if(path!==null && path.charAt(0)==="/"){
      path = path.substr(1);
    }

    var pathTokens = path.split("/");

    var url = "/#";
    var name = null;
    for(var index=0; index<pathTokens.length; index++){

      name = pathTokens[index];
      url += "/" + pathTokens[index];

      // some items we need to consider for the name of the breadcrumb
      if(name === "precinctsplits"){
        name = "precinct splits";
      }

      if(name === "streetsegments"){
        name = "street segments";
        url = null;
      }

      if(name === "electionadministration"){
        name = "election administration";
      }

      if(name === "electoraldistricts"){
        name = "electoral districts";
      }

      if(name === "electoraldistrict"){
        name = "electoral district";
      }

      if(name === "earlyvotesites"){
        name = "early vote sites";
      }

      if(name === "pollinglocations"){
        name = "polling locations";
      }

      if(name === "contestresult"){
        name = "contest result";
      }

      if(name === "ballotlineresults"){
        name = "ballot line results";
      }

      // if it's not the feed id token then camel case the name (the feed id is the 2nd token)
      if(index !==1){
        name = vipApp_ns.camelCase(name);
      }

      breadcrumbs.push(
        {
          "name": name,
          "url": url
        }
      );
    }

    return breadcrumbs;
  }

  $rootScope.exportFeedPost = function(feedData) {
    $http.post("/services/feeds/" + feedData.id, { feedName : feedData.feed_name, feedFolder: feedData.state_name.toLowerCase()})
      .success(function(data, status) {
        feedData.is_exporting = true;
        feedData.export_status = data;
      })
      .error(function(data, status) {
        feedData.export_status = "Error in export";
        feedData.is_exporting = true;
      });
  }

  /*
   * Generates a page Id based on the current URL
   *
   */
  $rootScope.generatePageId = function(feedId){

    var id = "";

    var path = $location.path();
    if(path!==null && path.charAt(0)==="/"){
      path = path.substr(1);
    }

    var pathTokens = path.split("/");

    for(var index=0; index<pathTokens.length; index++){

      var token = pathTokens[index];

      if(isNaN(token) && token !== feedId ){
        id += token.toLowerCase() + "-";
      }
    }

    id += 'content';

    return id;
  }
});
