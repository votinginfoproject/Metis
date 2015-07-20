'use strict';
/*
 * Feeds Locality Controller
 *
 */
function FeedLocalityCtrl($scope, $rootScope, $feedDataPaths, $feedsService, $routeParams, $appProperties, $location, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $scope.vipfeed = $routeParams.vipfeed;
  
  // get the locality param from the route
  var localityid = $routeParams.locality;

  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/election/state/localities/' + localityid,
                               scope: $rootScope,
                               key: 'feedLocality',
                               errorMessage: 'Could not retrieve Locality Data.'},
                             function(result) { $rootScope.feedLocality = result[0]; });

  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/election/state/localities/' + localityid + '/early-vote-sites',
                               scope: $rootScope,
                               key: 'feedEarlyVoteSites',
                               errorMessage: 'Could not retrieve Early Vote Sites Data for Locality ' + localityid + '.'},
                             function(result) { $scope.earlyVoteTable = $rootScope.createTableParams(ngTableParams, $filter, result, $appProperties.lowPagination, { id: 'asc' }); });

  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/election/state/localities/' + localityid + '/election-administration',
                               scope: $rootScope,
                               key: 'feedElectionAdministration',
                               errorMessage: 'Could not retrieve Locality Data.'},
                             function(result) { $rootScope.feedElectionAdministration = result[0]; });

  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/election/state/localities/' + localityid + '/precincts',
                               scope: $rootScope,
                               key: 'feedPrecincts',
                               errorMessage: 'Could not retrieve Precincts Data for Locality ' + localityid + '.'},
                             function(result) { $scope.precinctsTableParams = $rootScope.createTableParams(ngTableParams, $filter, result, $appProperties.lowPagination, { id: 'asc' }); });

  $rootScope.feedLocalityOverview = {};
  LocalityOverviewTable($feedDataPaths, $rootScope.feedLocalityOverview, feedid, localityid);

  // initialize page header variables
  $rootScope.setPageHeader("Locality", $rootScope.getBreadCrumbs(), "feeds", "", null);
}

function completionStat(counts) {
  if(counts["error_count"] == 0) {
    return 100;
  } else {
    var noErrors = counts["count"] - counts["error_count"];
    return Math.round(noErrors / counts["count"]);
  }
}

function LocalityOverviewTable($feedDataPaths, overview, feedid, localityid) {
  var overviewEarlyVoteSitesLink = '#/feeds/' + feedid + '/election/state/localities/' + localityid + '/overview/earlyvotesites/errors';
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/election/state/localities/' + localityid + '/overview/early-vote-sites',
                               scope: overview,
                               key: 'earlyVoteSites',
                               errorMessage: 'Could not retrieve Overview Data.'},
                             function(result) {
                              overview.earlyVoteSites = result[0];
                              overview.earlyVoteSites["completion"] = completionStat(overview.earlyVoteSites);
                              overview.earlyVoteSites["elementType"] = "Early Vote Sites";
                              overview.earlyVoteSites["link"] = overviewEarlyVoteSitesLink;
                            });
  
  var overviewElectionAdministrationsLink = '#/feeds/' + feedid + '/election/state/localities/' + localityid + '/overview/electionadministration/errors';
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/election/state/localities/' + localityid + '/overview/election-administrations',
                               scope: overview,
                               key: 'electionAdministrations',
                               errorMessage: 'Could not retrieve Overview Data.'},
                             function(result) { 
                              overview.electionAdministrations = result[0]; 
                              overview.electionAdministrations["completion"] = completionStat(overview.electionAdministrations);
                              overview.electionAdministrations["elementType"] = "Election Administrations";
                              overview.electionAdministrations["link"] = overviewElectionAdministrationsLink;
                            });

  var overviewPollingLocationsLink = '#/feeds/' + feedid + '/election/state/localities/' + localityid + '/overview/pollinglocations/errors';
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/election/state/localities/' + localityid + '/overview/polling-locations',
                               scope: overview,
                               key: 'pollingLocations',
                               errorMessage: 'Could not retrieve Overview Data.'},
                             function(result) { 
                              overview.pollingLocations = result[0]; 
                              overview.pollingLocations["completion"] = completionStat(overview.pollingLocations);
                              overview.pollingLocations["elementType"] = "Polling Locations";
                              overview.pollingLocations["link"] = overviewPollingLocationsLink;
                            });

  var overviewPrecinctsLink = '#/feeds/' + feedid + '/election/state/localities/' + localityid + '/overview/precincts/errors';
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/election/state/localities/' + localityid + '/overview/precincts',
                               scope: overview,
                               key: 'precincts',
                               errorMessage: 'Could not retrieve Overview Data.'},
                             function(result) { 
                              overview.precincts = result[0]; 
                              overview.precincts["completion"] = completionStat(overview.precincts);
                              overview.precincts["elementType"] = "Precincts"; 
                              overview.precincts["link"] = overviewPrecinctsLink;
                            });

  var overviewPrecinctSplitsLink = '#/feeds/' + feedid + '/election/state/localities/' + localityid + '/overview/precinctsplits/errors';
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/election/state/localities/' + localityid + '/overview/precinct-splits',
                               scope: overview,
                               key: 'precinctSplits',
                               errorMessage: 'Could not retrieve Overview Data.'},
                             function(result) { 
                              overview.precinctSplits = result[0]; 
                              overview.precinctSplits["completion"] = completionStat(overview.precinctSplits);
                              overview.precinctSplits["elementType"] = "Precinct Splits";
                              overview.precinctSplits["link"] = overviewPrecinctSplitsLink;
                            });

  var overviewStreetSegmentsLink = '#/feeds/' + feedid + '/election/state/localities/' + localityid + '/overview/streetsegments/errors';
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/election/state/localities/' + localityid + '/overview/street-segments',
                               scope: overview,
                               key: 'streetSegments',
                               errorMessage: 'Could not retrieve Overview Data.'},
                             function(result) { 
                              overview.streetSegments = result[0]; 
                              overview.streetSegments["completion"] = completionStat(overview.streetSegments);
                              overview.streetSegments["elementType"] = "Street Segments"; 
                              overview.streetSegments["link"] = overviewStreetSegmentsLink;
                            });
}