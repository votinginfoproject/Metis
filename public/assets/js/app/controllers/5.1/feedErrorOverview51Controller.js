'use strict';

function FeedErrorOverview51Ctrl($scope, $rootScope, $routeParams,  $feedDataPaths, $location) {
  var publicId = $routeParams.vipfeed;
  $scope.publicId = publicId;
  $scope.pageHeader.title = 'Errors';

  $rootScope.setPageHeader("Errors", [], "feeds", "", null);

  $scope.errors = null;

  $scope._toggleError = function (prefix, index) {
    var obj = jQuery("#" + prefix + "ErrorDetail" + index);
    var arrowClosed = jQuery("#" + prefix + "ErrorArrowClosed" + index);
    var arrowOpen = jQuery("#" + prefix + "ErrorArrowOpen" + index);

    if (obj.is(":visible")) {
      obj.hide();
      arrowClosed.show();
      arrowOpen.hide();
    } else {
      obj.show();
      arrowClosed.hide();
      arrowOpen.show();
    }
  }

  switch ($routeParams.type) {
  case "candidate_contests":
  case "candidate_selections":
  case "ballot_measure_contests":
  case "ballot_selections":
  case "retention_contests":
  case "party_contests":
  case "electoral_districts":
  case "candidates":
  case "offices":
    $scope.scopedErrorType = "Contests";
    $scope.scopedErrorUrl = '/db/feeds/' + publicId + '/xml/errors/contests/report';
    break;
  case "source":
  case "election":
    $scope.scopedErrorType = "Source and Election"
    $scope.scopedErrorUrl = '/db/feeds/' + publicId + '/xml/errors/source_election/report';
    break;
  case "election_administration":
    $scope.scopedErrorType = "Election Administration";
    $scope.scopedErrorUrl = '/db/feeds/' + publicId + '/xml/errors/election_administration/report';
    break;
  case "departments":
    $scope.scopedErrorType = "Departments";
    $scope.scopedErrorUrl = "/db/feeds/" + publicId + '/xml/errors/departments/report';
    break;
  case "voter_services":
    $scope.scopedErrorType = "Voter Services";
    $scope.scopedErrorUrl = "/db/feeds/" + publicId + '/xml/errors/voter_services/report';
    break;
  };

  $scope.toggleError = $scope._toggleError;

  $feedDataPaths.getResponse({ path: '/db' + $location.path(),
                               scope:  $scope,
                               key: 'errors',
                               errorMessage: 'Cound not retrieve errors' },
                             function (results) {
                               $scope.fatalErrors = results.filter(function(row) {
                                 return row.severity === 'fatal' || row.severity === 'critical';
                               });
                               $scope.minorErrors = results.filter(function(row) {
                                 return row.severity === 'warnings' || row.severity === 'errors';
                               });
                             });
}
