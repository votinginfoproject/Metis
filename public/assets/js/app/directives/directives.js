/*
 * A directive that renders out an Element Table that consists of:
 *  - Element Type
 *  - Amount
 *  - Completion (with custom styling)
 *  - Errors (with custom styling)
 */
vipApp.directive('ngElementtable', function() {
  return {
    restrict: 'A',
    require: '^ngModel',
    scope: {
      ngModel: '=',  // our angular model that we will loop over
      loading: '=',  // our angular model that used to determine when to show and hide the loading indicator (in most cases will be the same as our ngModel)
      label: '@'     // a label used when adding in ids to the table cells
    },
    templateUrl: 'assets/js/app/directives/elementTableTemplate.html'
  }
});

/*
 * A directive that renders out an Error Table
 *
 */
vipApp.directive('ngErrorTable', function() {
  return {
    restrict: 'A',
    require: '^errors',
    scope: {
      errors: '=',  // our angular model that we will loop over
      toggleError: '=', // the scope function to call on an on-click event for each row
      errorsTableParams: '=',  // our NgTable model
      loading: '='  // our angular model that used to determine when to show and hide the loading indicator (in most cases will be the same as our ngModel)
    },
    templateUrl: 'assets/js/app/directives/errorTableTemplate.html'
  }
});

/*
 * A directive that renders out an Election Administration section
 *
 */
vipApp.directive('ngElectionAdministrationTable', function() {
  return {
    restrict: 'A',
    require: '^feedElectionAdministration',
    scope: {
      feedElectionAdministration: '=',  // our angular model that we will loop over
      loading: '='  // our angular model that used to determine when to show and hide the loading indicator (in most cases will be the same as our ngModel)
    },
    templateUrl: 'assets/js/app/directives/electionAdministrationTableTemplate.html'
  }
});

/*
 * A directive that renders out an Electoral District page
 *
 */
vipApp.directive('ngElectoralDistrictPage', function() {
  return {
    restrict: 'A',
    require: '^feedElectoralDistrict',
    scope: {
      feedElectoralDistrict: '=',  // our angular model that we will loop over

      feedContests: '=', // contests section
      contestsTableParams: '=', // contests sorting

      feedPrecincts: '=', // precincts section
      precinctsTableParams: '=', // precincts sorting

      feedPrecinctSplits: '=', // precinct splits section
      precinctSplitsTableParams: '=', // precinct splits sorting

      pageId: '=', // used to generate a unique id for the page
      loading: '='  // our angular model that used to determine when to show and hide the loading indicator (in most cases will be the same as our ngModel)
    },
    templateUrl: 'assets/js/app/directives/electoralDistrictPageTemplate.html'
  }
});