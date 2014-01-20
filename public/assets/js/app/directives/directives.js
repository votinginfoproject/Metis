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
vipApp.directive('ngErrortable', function() {
  return {
    restrict: 'A',
    require: '^ngModel',
    scope: {
      ngModel: '=',  // our angular model that we will loop over
      onrow: '=', // the scope function to call on an on-click event for each row
      tableparams: '=',  // our NgTable model
      loading: '='  // our angular model that used to determine when to show and hide the loading indicator (in most cases will be the same as our ngModel)
    },
    templateUrl: 'assets/js/app/directives/errorTableTemplate.html'
  }
});