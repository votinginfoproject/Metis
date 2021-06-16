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
var vipApp =
    angular
    .module('vipApp',
            ['ngTable', 'ngRoute', 'ngCookies', 'vipFilters',
             'ngFileUpload', 'auth0.auth0', 'ui.date'])
    .config(['$controllerProvider',
             function($controllerProvider) {
               $controllerProvider.allowGlobals();
             }]);

vipApp.constant('$appProperties', {
  contextRoot: '',
  servicesPath: '/services',
  lowPagination: 10,
  highPagination: 30
});

var formatVipFeedID = function(name) {
  var vipFeedID = name.split("-");

  if(vipFeedID.length < 5) {
    return vipFeedID.join("-");
  } else {
    vipFeedID.pop();
    var electionDate = vipFeedID.slice(0,3);
    var electionName = vipFeedID.slice(3,vipFeedID.length);
    return electionDate.join("-") + " " + electionName.join(" ");
  }
};

/*
 * https://github.com/angular/angular.js/commit/aa077e81129c740041438688dff2e8d20c3d7b52
 *
 */
vipApp.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix("");
}]);

/*
 * VIP App configuration
 *
 * Will setup routing and retrieve reference data for the app before any pages are loaded
 *
 */
vipApp.config(['$routeProvider', '$appProperties', '$httpProvider', '$logProvider', 'angularAuth0Provider',
  function ($routeProvider, $appProperties, $httpProvider, $logProvider, angularAuth0Provider) {

    angularAuth0Provider.init(config.auth0);

    // disable the logProvider's debugging as Ngtable uses it and it crowds out all other logging
    // without any other way to turn it off
    $logProvider.debugEnabled(false);

    $routeProvider.when('/', {
      templateUrl: $appProperties.contextRoot + '/app/partials/home.html',
      controller: 'HomeCtrl'
    });

    $routeProvider.when('/login-callback', {
      templateUrl: $appProperties.contextRoot + '/app/partials/loginCallback.html',
      controller: 'LoginCallbackCtrl'
    })

    $routeProvider.when('/logout', {
      templateUrl: $appProperties.contextRoot + '/app/partials/home.html',
      controller: 'LogoutCtrl'
    })

    $routeProvider.when('/profile', {
      templateUrl: $appProperties.contextRoot + '/app/partials/profile.html',
      controller: 'ProfileCtrl'
    })

    $routeProvider.when('/testing/vit', {
      templateUrl: $appProperties.contextRoot + '/app/partials/testing/vit.html',
      controller: 'VitCtrl'
    });

    $routeProvider.when('/testing/addresses',{
      templateUrl: $appProperties.contextRoot + '/app/partials/testing/addresses.html',
      controller: 'AddressesCtrl'
    });

    $routeProvider.when('/county-data/centralization',{
      templateUrl: $appProperties.contextRoot + '/app/partials/centralization/centralization.html',
      controller: 'CentralizationCtrl'
    });

    $routeProvider.when('/data-upload/upload',{
      templateUrl: $appProperties.contextRoot + '/app/partials/data-upload/upload.html',
      controller: 'DataUploadCtrl'
    });

    $routeProvider.when('/feeds', {
      templateUrl: $appProperties.contextRoot + '/app/partials/feeds.html',
      controller: 'FeedsCtrl'
    });

    $routeProvider.when('/feeds/:vipfeed', {
      templateUrl: $appProperties.contextRoot + '/app/partials/feed-overview.html',
      controller: 'FeedOverviewCtrl'
    });

    // 5.X feeds
    $routeProvider.when('/5/feeds/:vipfeed', {
      templateUrl: $appProperties.contextRoot + '/app/partials/5/feed-overview.html',
      controller: 'FeedOverview5Ctrl'
    });

    $routeProvider.when('/5/feeds/:vipfeed/source', {
      templateUrl: $appProperties.contextRoot + '/app/partials/5/source.html',
      controller: 'FeedSource5Ctrl'
    });

    $routeProvider.when('/5/feeds/:vipfeed/errors', {
      templateUrl: $appProperties.contextRoot + '/app/partials/5/errors.html',
      controller: 'FeedErrors5Ctrl'
    });

    var v5_errors = {templateUrl: $appProperties.contextRoot + '/app/partials/5/errors.html',
                     controller: 'FeedErrorOverview5Ctrl' };

    $routeProvider
      .when('/5/feeds/:vipfeed/overview/:type/errors', v5_errors)

    var locality_errors = {templateUrl: $appProperties.contextRoot + '/app/partials/5/errors.html',
                     controller: 'LocalityErrorsOverview5Controller' };

    $routeProvider
      .when('/5/feeds/:vipfeed/election/state/localities/:locality_id/:type/errors', locality_errors)

    $routeProvider.when('/5/feeds/:vipfeed/election/state/localities/:locality', {
      templateUrl: $appProperties.contextRoot + '/app/partials/5/locality-overview.html',
      controller: 'LocalityOverview5Ctrl'
    });

    // 3.0 feeds
    $routeProvider.when('/feeds/:vipfeed/source', {
      templateUrl: $appProperties.contextRoot + '/app/partials/feed-source.html',
      controller: 'FeedSourceCtrl'
    });

    $routeProvider.when('/feeds/:vipfeed/election', {
      templateUrl: $appProperties.contextRoot + '/app/partials/feed-source.html',
      controller: 'FeedSourceCtrl'
    });

    $routeProvider.when('/feeds/:vipfeed/election/contests', {
      templateUrl: $appProperties.contextRoot + '/app/partials/feed-contests.html',
      controller: 'FeedContestsCtrl'
    });

    $routeProvider.when('/feeds/:vipfeed/election/contests/:contest', {
      templateUrl: $appProperties.contextRoot + '/app/partials/feed-contest.html',
      controller: 'FeedContestCtrl'
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
      .when('/feeds/:vipfeed/election/contests/:contest/ballot/referenda/:referendum/ballotresponses/errors', error)

    // error indexes

      // for all overview modules under the Feed Overview page
      .when('/feeds/:vipfeed/overview/:type/errors', error)

      // overview modules under a specific Locality
      .when('/feeds/:vipfeed/election/state/localities/:locality/overview/earlyvotesites/errors', error)
      .when('/feeds/:vipfeed/election/state/localities/:locality/overview/electionadministrations/errors', error)
      .when('/feeds/:vipfeed/election/state/localities/:locality/overview/pollinglocations/errors', error)
      .when('/feeds/:vipfeed/election/state/localities/:locality/overview/precinctsplits/errors', error)
      .when('/feeds/:vipfeed/election/state/localities/:locality/overview/precincts/errors', error)
      .when('/feeds/:vipfeed/election/state/localities/:locality/overview/streetsegments/errors', error)

      // overview modules under a specific Contest
      .when('/feeds/:vipfeed/election/contests/:contest/overview/ballot/errors', error)
      .when('/feeds/:vipfeed/election/contests/:contest/overview/candidates/errors', error)
      .when('/feeds/:vipfeed/election/contests/:contest/overview/electoraldistrict/errors', error)
      .when('/feeds/:vipfeed/election/contests/:contest/overview/referenda/errors', error);

    // default when no path specified
    $routeProvider.otherwise({redirectTo: '/'});


    /*
     * HTTP Interceptor
     * Will be used to check to see if user is authenticated
     */
    $httpProvider.interceptors.push(function ($q, $location, $rootScope) {
      return {
        response: function(response) {
          // do something on success
          return response;
        },
        responseError: function(response) {
          // do something on error

          if (response.status === 401) {
            console.log("AUTH DENIED!");
            // nullify the user object
            $rootScope.user = null;
            localStorage.removeItem('auth0_access_token');
            localStorage.removeItem('auth0_id_token');
            localStorage.removeItem('auth0_expires_at');
            localStorage.removeItem('auth0_user');
            $location.url('/');
          }

          if (canRecover(response)) {
            return responseOrNewPromise
          }
          return $q.reject(response);
        }
      }
    });

  }]); // vipApp.config


/*
 * Static initialization block
 *
 * Runs after the vipApp.config block above.
 *
 */
vipApp.run(function ($rootScope, $appService, $location, $appProperties, $window, $anchorScroll, $http, $timeout, $authService) {

  $rootScope.getDueDateText = function(date){
    if(date){
      var dueDate = moment(date, "YYYY-MM-DD").subtract(23, 'days');
      var dueDateText = moment(dueDate).utc().format('YYYY-MM-DD');
      return dueDateText;
    } else {
      return "N/A";
    }
  };

  $rootScope.hasRole = $authService.hasRole;

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

  // Handle the authentication
  // result in the hash
  $authService.handleAuthentication();

  /*
   * Set a flag to determine if the screen is in mobile dimensions
   */
  var mobileThreshhold = 1116;
  var inMobileThreshhold = false;
  $rootScope.toggleAside = true;
  $rootScope.mobileDimensions = ($window.innerWidth < mobileThreshhold);

  /*
   * When the window is resized manage the show/hiding of the aside
   */
  var checkResize = function(){

    $rootScope.mobileDimensions = ($window.innerWidth < mobileThreshhold);
    if(!$rootScope.mobileDimensions){

      inMobileThreshhold = false;
      $rootScope.toggleAside = true;
      $("#asideSection").show();
    } else {

      // only do 1 time, per each iteration of going into the mobile threshold
      if(!inMobileThreshhold){
        $("#asideSection").hide();
        inMobileThreshhold = true;
      }

    }

    $rootScope.$apply();
  }

  window.onresize = checkResize;

  // in case we start out in the mobile dimensions
  //$timeout(function() { checkResize(); }, 200);

  /*
   * Independent toggle the aside - used with a onclick event
   */
  $rootScope.toggleAsideFunc = function(){
    if($rootScope.mobileDimensions){
      $rootScope.toggleAside = !$rootScope.toggleAside;

      if($rootScope.toggleAside){
        $("#asideSection").slideUp();
      } else {
        $("#asideSection").slideDown();
      }
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
        // change any IDs to integers for smarter sorting
        $.map(data, function(row) {
          if (row['id']) row['id'] = parseInt(row['id']);
          return row;
        });

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

    // Since we want to eliminate the "Feeds" link from the breadcrumb path, we start off at /#/feeds and increment the for loop from 1 instead of 0

    var url = "/#/feeds";
    var name = null;

    var makeUrlNull = false;

    for(var index=1; index<pathTokens.length; index++){

      name = pathTokens[index];
      url += "/" + pathTokens[index];

      // nothing to link to when showing the overview error pages
      if(name==="overview"){
        makeUrlNull = true;
      }

      // some items we need to consider for the name of the breadcrumb
      if(name === "precinctsplits"){
        name = "precinct splits";
      }

      if(name === "streetsegments"){
        name = "street segments";
        url = null;
      }

      if(name === "source"){
        name = "source & election";
        url = null;
      }

      if(name === "electionadministration"){
        name = "election administration";
      }

      if(name === "electionadministrations"){
        name = "election administrations";
      }

      if(name === "electionofficials"){
        name = "election officials";
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

      if(name === "contestresults"){
        name = "contest results";
      }

      if(name === "errorindex"){
        name = "error index";
      }

      // if it's not the feed id token then camel case the name (the feed id is the 2nd token)
      if(index !==1){
        name = vipApp_ns.camelCase(name);
      } else {
        name = formatVipFeedID(name);
      }

      if(makeUrlNull){
        url = null;
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

    /*
     * https://github.com/angular/angular.js/blob/master/CHANGELOG.md#http-due-to
     *
     */
    $http.post("/services/feeds/" + feedData.id, { feedName : feedData.feed_name, feedFolder: feedData.fips_code })
      .then(function onSuccess(response) {
        var data = response.data;
        feedData.is_exporting = true;

        // change the path that data represents to a absolute path
        // path returned as: ./FEEDS/39/OH_TEST_FEED.ZIP

        // get the host path before the angular hash in the url
        var hostpath = (($location.absUrl()).split("#"))[0];

        data = data.substr("./".length);

        var fullPath = hostpath + data;
        var parentPath = hostpath + "feeds/";

        feedData.export_success = true;
        feedData.export_status = fullPath;
      }, function onError(response) {
        feedData.export_success = false;
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

  /*
   * Generates the appropriate Error Page title
   *
   */
  $rootScope.generateErrorPageTitle = function(total_errors){

    var title = "";
    var breadcrumbs = $rootScope.pageHeader.breadcrumbs

    var errorText = "Error";
    if(total_errors!==1){
      errorText = "Errors";
    }

    var feedId = breadcrumbs[1].name;

    if(breadcrumbs[breadcrumbs.length-1].name !== "Errors"){
      return null;
    }

    // not an id
    if( isNaN(breadcrumbs[breadcrumbs.length-2].name )){
      var item = breadcrumbs[breadcrumbs.length-2].name;

      if(item === feedId){
        title = "Total " + errorText + " in Feed";
      } else {
        title = errorText + " in " + item;
      }

    } else {
      var item = breadcrumbs[breadcrumbs.length-3].name;

      // remove the plural "s" from the name
      if(item.charAt(item.length-1).toLocaleLowerCase()==='s'){
        item = item.substring(0,item.length-1);

        // if we are now left with "ie" at the end, change to "y"
        // example is "Localities" -> remove plural "s" -> "localitie" -> chnage "ie" to "y" -> "locality"
        if(item.lastIndexOf("ie")=== item.length-2){
          item = item.substring(0,item.length-2) + "y";
        }
      }

      title = errorText + " in " + item + " ID: " + breadcrumbs[breadcrumbs.length-2].name;
    }

    return title;

  }

  var formatDurationNumber = function(n) {
    if (n && n < 10) {
      return "0" + n;
    } else if (n) {
      return n;
    } else {
      return "00"
    }
  }

  // Format the duration objects for feeds
  $rootScope.formatDuration = function(duration) {
    return formatDurationNumber(duration.hours) + ":" +
      formatDurationNumber(duration.minutes) + ":" +
      formatDurationNumber(duration.seconds);
  }

  $rootScope.feedId = function () {
    var locationParts = window.location.hash.split("/");
    if (locationParts[1] === "feeds") {
      return locationParts[2];
    }
  }

  $rootScope.feedPath = function(feed) {
    if (feed.spec_version === "3.0" || !feed.spec_version) {
      return "#/feeds/" + feed.public_id;
    } else {
      return "#/5/feeds/" + feed.public_id;
    }
  }

  $rootScope.urlForFeed = function(path) {
    var baseUrl = "#/feeds/" + $rootScope.feedId();
    return baseUrl + path;
  }

  $rootScope.errorReportUrl = function() {
    return '/db/feeds/' + $rootScope.feedId() + '/errors/report';
  }
});
