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
    $scope.scopedErrorType = "Candidate Contests";
    $scope.scopedErrorUrl = '/db/feeds/' + publicId + '/xml/errors/candidate_contests/report';
    break
  case "candidate_selection":
    $scope.scopedErrorType = "Candidate Selection";
    $scope.scopedErrorUrl = '/db/feeds/' + publicId + '/xml/errors/candidate_selection/report';
    break
  case "ballot_measure_contests":
    $scope.scopedErrorType = "Ballot Measure Contests";
    $scope.scopedErrorUrl = '/db/feeds/' + publicId + '/xml/errors/ballot_measure_contests/report';
    break
  case "ballot_selections":
    $scope.scopedErrorType = "Ballot Selections";
    $scope.scopedErrorUrl = '/db/feeds/' + publicId + '/xml/errors/ballot_selections/report';
    break
  case "retention_contests":
    $scope.scopedErrorType = "Retention Contests";
    $scope.scopedErrorUrl = '/db/feeds/' + publicId + '/xml/errors/retention_contests/report';
    break
  case "party_contests":
    $scope.scopedErrorType = "Party Contests";
    $scope.scopedErrorUrl = '/db/feeds/' + publicId + '/xml/errors/party_contests/report';
    break
  case "electoral_districts":
    $scope.scopedErrorType = "Electoral Disctricts";
    $scope.scopedErrorUrl = '/db/feeds/' + publicId + '/xml/errors/electoral_districts/report';
    break
  case "candidates":
    $scope.scopedErrorType = "Candidates";
    $scope.scopedErrorUrl = '/db/feeds/' + publicId + '/xml/errors/candidates/report';
    break
  case "offices":
    $scope.scopedErrorType = "Offices";
    $scope.scopedErrorUrl = '/db/feeds/' + publicId + '/xml/errors/offices/report';
    break;
  case "source":
  case "election":
    $scope.scopedErrorType = "Source and Election"
    $scope.scopedErrorUrl = '/db/feeds/' + publicId + '/xml/errors/source_election/report';
    break;
  case "street_segments":
    $scope.scopedErrorType = "Street Segments"
    $scope.scopedErrorUrl = '/db/feeds/' + publicId + '/xml/errors/street_segments/report';
    break;
  case "state":
    $scope.scopedErrorType = "State"
    $scope.scopedErrorUrl = '/db/feeds/' + publicId + '/xml/errors/state/report';
    break;
  case "precincts":
    $scope.scopedErrorType = "Precincts"
    $scope.scopedErrorUrl = '/db/feeds/' + publicId + '/xml/errors/precincts/report';
    break;
  case "polling_locations":
    $scope.scopedErrorType = "Polling Locations"
    $scope.scopedErrorUrl = '/db/feeds/' + publicId + '/xml/errors/polling_locations/report';
    break;
  case "localities":
    $scope.scopedErrorType = "Localities"
    $scope.scopedErrorUrl = '/db/feeds/' + publicId + '/xml/errors/localities/report';
    break;
  case "hours_open":
    $scope.scopedErrorType = "Hours Open"
    $scope.scopedErrorUrl = '/db/feeds/' + publicId + '/xml/errors/hours_open/report';
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
