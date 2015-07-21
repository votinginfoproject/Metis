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

  $rootScope.feedLocalityOverview = { 
                                      "earlyVoteSites": {},
                                      "electionAdministrations": {},
                                      "pollingLocations": {},
                                      "precincts": {},
                                      "precinctSplits": {},
                                      "streetSegments": {} 
                                    };

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
                               scope: overview.earlyVoteSites,
                               key: 'info',
                               errorMessage: 'Could not retrieve Overview Data.'},
                             function(result) {
                              overview.earlyVoteSites.info = result[0];
                              overview.earlyVoteSites.info["elementType"] = "Early Vote Sites";
                              overview.earlyVoteSites.info["link"] = overviewEarlyVoteSitesLink;
                            });
  
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/election/state/localities/' + localityid + '/overview/early-vote-sites/errors',
                               scope: overview.earlyVoteSites,
                               key: 'errors',
                               errorMessage: 'Could not retrieve error count for Overview Data.'},
                             function(result) {
                              overview.earlyVoteSites.errors = result[0];
                             });

  
  var overviewElectionAdministrationsLink = '#/feeds/' + feedid + '/election/state/localities/' + localityid + '/overview/electionadministration/errors';
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/election/state/localities/' + localityid + '/overview/election-administrations',
                               scope: overview.electionAdministrations,
                               key: 'info',
                               errorMessage: 'Could not retrieve Overview Data.'},
                             function(result) { 
                              overview.electionAdministrations.info = result[0]; 
                              overview.electionAdministrations.info["elementType"] = "Election Administrations";
                              overview.electionAdministrations.info["link"] = overviewElectionAdministrationsLink;
                            });
  
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/election/state/localities/' + localityid + '/overview/election-administrations/errors',
                               scope: overview.electionAdministrations,
                               key: 'errors',
                               errorMessage: 'Could not retrieve error count for Overview Data.'},
                             function(result) {
                              overview.electionAdministrations.errors = result[0];
                             });


  var overviewPollingLocationsLink = '#/feeds/' + feedid + '/election/state/localities/' + localityid + '/overview/pollinglocations/errors';
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/election/state/localities/' + localityid + '/overview/polling-locations',
                               scope: overview.pollingLocations,
                               key: 'info',
                               errorMessage: 'Could not retrieve Overview Data.'},
                             function(result) { 
                              overview.pollingLocations.info = result[0]; 
                              overview.pollingLocations.info["elementType"] = "Polling Locations";
                              overview.pollingLocations.info["link"] = overviewPollingLocationsLink;
                            });
  
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/election/state/localities/' + localityid + '/overview/polling-locations/errors',
                               scope: overview.pollingLocations,
                               key: 'errors',
                               errorMessage: 'Could not retrieve error count for Overview Data.'},
                             function(result) {
                              overview.pollingLocations.errors = result[0];
                             });


  var overviewPrecinctsLink = '#/feeds/' + feedid + '/election/state/localities/' + localityid + '/overview/precincts/errors';
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/election/state/localities/' + localityid + '/overview/precincts',
                               scope: overview.precincts,
                               key: 'info',
                               errorMessage: 'Could not retrieve Overview Data.'},
                             function(result) { 
                              overview.precincts.info = result[0]; 
                              overview.precincts.info["elementType"] = "Precincts"; 
                              overview.precincts.info["link"] = overviewPrecinctsLink;
                            });
  
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/election/state/localities/' + localityid + '/overview/precincts/errors',
                               scope: overview.precincts,
                               key: 'errors',
                               errorMessage: 'Could not retrieve error count for Overview Data.'},
                             function(result) {
                              overview.precincts.errors = result[0];
                             });


  var overviewPrecinctSplitsLink = '#/feeds/' + feedid + '/election/state/localities/' + localityid + '/overview/precinctsplits/errors';
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/election/state/localities/' + localityid + '/overview/precinct-splits',
                               scope: overview.precinctSplits,
                               key: 'info',
                               errorMessage: 'Could not retrieve Overview Data.'},
                             function(result) { 
                              overview.precinctSplits.info = result[0]; 
                              overview.precinctSplits.info["elementType"] = "Precinct Splits";
                              overview.precinctSplits.info["link"] = overviewPrecinctSplitsLink;
                            });
  
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/election/state/localities/' + localityid + '/overview/precinct-splits/errors',
                               scope: overview.precinctSplits,
                               key: 'errors',
                               errorMessage: 'Could not retrieve error count for Overview Data.'},
                             function(result) {
                              overview.precinctSplits.errors = result[0];
                             });


  var overviewStreetSegmentsLink = '#/feeds/' + feedid + '/election/state/localities/' + localityid + '/overview/streetsegments/errors';
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/election/state/localities/' + localityid + '/overview/street-segments',
                               scope: overview.streetSegments,
                               key: 'info',
                               errorMessage: 'Could not retrieve Overview Data.'},
                             function(result) { 
                              overview.streetSegments.info = result[0]; 
                              overview.streetSegments.info["elementType"] = "Street Segments"; 
                              overview.streetSegments.info["link"] = overviewStreetSegmentsLink;
                            });
  
  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/election/state/localities/' + localityid + '/overview/street-segments/errors',
                               scope: overview.streetSegments,
                               key: 'errors',
                               errorMessage: 'Could not retrieve error count for Overview Data.'},
                             function(result) {
                              overview.streetSegments.errors = result[0];
                             });

}