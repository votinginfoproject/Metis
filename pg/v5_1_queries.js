var conn = require('./conn.js');
var queries = require('./queries.js');
var resp = require('./response.js');
var util = require('./util.js');

var localityOverviewQuery = "select l.id as identifier, l.name, l.precinct_count as precincts \
                             FROM results r \
                             LEFT JOIN v5_dashboard.localities l ON l.results_id = r.id \
                             WHERE r.public_id = $1 \
                             ORDER BY l.name;";

var overviewQuery = "select r.id, \
                     xtv_state.value as state_name, \
                     xtv_type.value as election_type, \
                     xtv_date.value as election_date \
                     from results r \
                     left join xml_tree_values xtv_state on xtv_state.results_id = r.id \
                                           and xtv_state.simple_path = 'VipObject.State.Name' \
                     left join xml_tree_values xtv_type on xtv_type.results_id = r.id \
                                           and xtv_type.path ~ 'VipObject.*.Election.*.ElectionType.*.Text.0' \
                     left join xml_tree_values xtv_date on xtv_date.results_id = r.id \
                                           and xtv_date.simple_path = 'VipObject.Election.Date' \
                     where r.public_id = $1;";

var totalErrorsQuery = "select (select count(v.*) \
                                from xml_tree_validations v \
                                where r.id = v.results_id \
                                  and v.severity in ('fatal', 'critical', 'errors')) as total_errors, \
                               (select count(v.*) \
                                from xml_tree_validations v \
                                where r.id = v.results_id \
                                  and v.severity = 'warnings') as total_warnings \
                        from results r where r.public_id = $1;"

var errorSummary =
    "WITH errors AS (SELECT DISTINCT ON (v.severity, v.scope, v.error_type) \
                  v.results_id, \
                  COUNT(1) AS count, \
                  v.severity, \
                  v.scope, \
                  v.error_type, \
                  (array_agg(v.path))[1] AS path, \
                  (array_agg(v.error_data))[1] AS error_data \
                FROM results r \
                LEFT JOIN xml_tree_validations v ON v.results_id = r.id \
                WHERE r.public_id = $1 \
                GROUP BY v.severity, v.scope, v.error_type, v.results_id) \
     SELECT errors.*, x.value AS identifier \
     FROM errors \
     LEFT JOIN xml_tree_values x  \
            ON x.path = subpath(errors.path,0,4) || 'id' \
     AND x.results_id = errors.results_id;";

var errorResponder = function(query, params) {
  return util.simpleQueryResponder(query, util.paramExtractor(params));
};

var overallErrorQuery = function(scope) {
    return buildErrorQuery("", "element_type(xtv.path) = '" + scope + "'");
};

var getScopedLocalityErrors = function (scope) {
    return "select distinct on (xtv.severity, xtv.scope, xtv.error_type) \
                                                count(1), xtv.severity, xtv.scope, \
                                                xtv.error_type, (array_agg(xtv.path))[1] as path, \
                                                (array_agg(xtv.error_data))[1] as error_data \
                            from xml_tree_validations xtv \
                            inner join results r on r.id = xtv.results_id \
                            where r.public_id = $1 \
                              and xtv.path <@ (select paths from v5_dashboard.paths_by_locality \
                                               where locality_id = $2 and results_id = r.id) \
                              and element_type(xtv.path) = '" + scope + "' \
                            group by xtv.severity, xtv.scope, xtv.error_type; "};

var buildErrorQuery = function(joins, wheres) {
  var wherePart = "";
  if (wheres) {
    wherePart = "AND " + wheres;
  }

  return "SELECT DISTINCT ON (xtv.severity, xtv.scope, xtv.error_type) \
                 COUNT(1), xtv.severity, xtv.scope, xtv.error_type, \
                 (array_agg(xtv.path))[1] AS path, \
                 (array_agg(xtv.error_data))[1] AS error_data \
          FROM xml_tree_validations xtv \
          INNER JOIN results r ON r.id = xtv.results_id " +
         joins +
         " WHERE r.public_id = $1 " + wherePart +
         " GROUP BY xtv.severity, xtv.scope, xtv.error_type";
};


var overviewTableRow = function(row, type, dbTable, link) {
  return {element_type: type,
          count: row[dbTable + '_count'],
          complete_pct: row[dbTable + '_completion'],
          error_count: row[dbTable + '_errors'],
          link: link};
};

var getLocalityDetail = function(req, res) {
  var publicId = req.params.publicId;
  var localityId = req.params.localityId;

  conn.query(function(client) {
    client.query("SELECT l.* \
                  from results r \
                  left join v5_dashboard.localities l on r.id = l.results_id \
                  where r.public_id = $1 and l.id = $2 limit 1;",
                 [decodeURIComponent(publicId),
                  decodeURIComponent(localityId)],
                 function(err, result) {
                   var row = result.rows[0];
                   if (row !== undefined) {
                     var summaries = {
                       locality: {name: row.name,
                                  type: row.type,
                                  id:   row.id,
                                  error_count: row.error_count},
                       pollingLocations: [
                         overviewTableRow(row, 'Street Segments', 'street_segment', '#/5.1/feeds/' + publicId + '/election/state/localities/'+ row.id + '/street_segments/errors'),
                         overviewTableRow(row, 'Precincts', 'precinct', '#/5.1/feeds/' + publicId + '/election/state/localities/'+ row.id + '/precincts/errors'),
                         overviewTableRow(row, 'Polling Location', 'polling_location', '#/5.1/feeds/' + publicId + '/election/state/localities/'+ row.id + '/polling_locations/errors'),
                         overviewTableRow(row, 'Hours Open', 'hours_open', '#/5.1/feeds/' + publicId + '//election/state/localities/'+ row.id + '/hours_open/errors')
                       ],
                       voterResources: [
                         overviewTableRow(row, 'Election Administration', 'election_administration', '#/5.1/feeds/' + publicId + '/election/state/localities/'+ row.id + '/election_administration/errors'),
                         overviewTableRow(row, 'Departments', 'department', '#/5.1/feeds/' + publicId + '/election/state/localities/'+ row.id + '/departments/errors'),
                         overviewTableRow(row, 'Voter Services', 'voter_service', '#/5.1/feeds/' + publicId + '/election/state/localities/'+ row.id + '/voter_services/errors'),
                       ]
                     };
                     resp.writeResponse(summaries, res);
                   }
                 });
  });
};

var getFeedOverviewSummaryData = function(req, res) {
  var feedid = req.params.feedid;
  conn.query(function(client) {
    client.query("SELECT s.* FROM v5_statistics s \
                  INNER JOIN results r ON s.results_id = r.id \
                  WHERE r.public_id=$1",
                 [decodeURIComponent(feedid)],
                 function(err, result) {
                     var row = result.rows[0];
                     if (row !== undefined){
                         var summaries = {
                           pollingLocations: [
                             overviewTableRow(row, 'Street Segments', 'street_segment', '#/5.1/feeds/' + feedid + '/overview/street_segments/errors'),
                             overviewTableRow(row, 'State', 'state', '#/5.1/feeds/' + feedid + '/overview/state/errors'),
                             overviewTableRow(row, 'Precincts', 'precinct', '#/5.1/feeds/' + feedid + '/overview/precincts/errors'),
                             overviewTableRow(row, 'Polling Location', 'polling_location', '#/5.1/feeds/' + feedid + '/overview/polling_locations/errors'),
                             overviewTableRow(row, 'Localities', 'locality', '#/5.1/feeds/' + feedid + '/overview/localities/errors'),
                             overviewTableRow(row, 'Hours Open', 'hours_open', '#/5.1/feeds/' + feedid + '/overview/hours_open/errors')
                           ],
                           voterResources: [
                             overviewTableRow(row, 'Election Administration', 'election_administration', '#/5.1/feeds/' + feedid + '/overview/election_administration/errors'),
                             overviewTableRow(row, 'Departments', 'department', '#/5.1/feeds/' + feedid + '/overview/departments/errors'),
                             overviewTableRow(row, 'Voter Services', 'voter_service', '#/5.1/feeds/' + feedid + '/overview/voter_services/errors'),
                           ],
                           contests: [
                             overviewTableRow(row, 'Candidate Contests', 'candidate_contest', '#/5.1/feeds/' + feedid + '/overview/candidate_contests/errors'),
                             overviewTableRow(row, 'Candidate Selections', 'candidate_selection', '#/5.1/feeds/' + feedid + '/overview/candidate_selection/errors'),
                             overviewTableRow(row, 'Ballot Measure Contests', 'ballot_measure_contest', '#/5.1/feeds/' + feedid + '/overview/ballot_measure_contests/errors'),
                             overviewTableRow(row, 'Ballot Selections', 'ballot_selection', '#/5.1/feeds/' + feedid + '/overview/ballot_selections/errors'),
                             overviewTableRow(row, 'Retention Contests', 'retention_contest', '#/5.1/feeds/' + feedid + '/overview/retention_contests/errors'),
                             overviewTableRow(row, 'Party Contests', 'party_contest', '#/5.1/feeds/' + feedid + '/overview/party_contests/errors'),
                             overviewTableRow(row, 'Electoral Districts', 'electoral_district', '#/5.1/feeds/' + feedid + '/overview/electoral_districts/errors'),
                             overviewTableRow(row, 'Candidates', 'candidate', '#/5.1/feeds/' + feedid + '/overview/candidates/errors'),
                             overviewTableRow(row, 'Offices', 'office', '#/5.1/feeds/' + feedid + '/overview/offices/errors'),
                           ],
                           sourceElection: [
                             overviewTableRow(row, 'Source', 'source', '#/5.1/feeds/' + feedid + '/overview/source/errors'),
                             overviewTableRow(row, 'Election', 'election', '#/5.1/feeds/' + feedid + '/overview/election/errors'),
                           ]
                         };
                       resp.writeResponse(summaries, res);
                     }
                 });
  });
};

var feedSource = "select s.*, stats.source_errors as error_count \
                  from results r \
                  left join v5_dashboard.sources s on r.id = s.results_id \
                  left join v5_statistics stats on r.id = stats.results_id \
                  where public_id = $1;";

var feedElection = "select e.*, stats.election_errors as error_count \
                    from results r \
                    left join v5_dashboard.elections e on r.id = e.results_id \
                    left join v5_statistics stats on r.id = stats.results_id \
                    where r.public_id = $1;";

var localityErrors = " select * from v5_dashboard.locality_error_report($1, $2)"

module.exports = {
  errorSummary: util.simpleQueryResponder(errorSummary, util.paramExtractor()),
  feedOverview: util.simpleQueryResponder(overviewQuery, util.paramExtractor()),
  localityOverview: util.simpleQueryResponder(localityOverviewQuery, util.paramExtractor()),
  localityDetail: getLocalityDetail,
  feedOverviewSummaryData: getFeedOverviewSummaryData,
  source: util.simpleQueryResponder(feedSource, util.paramExtractor()),
  election: util.simpleQueryResponder(feedElection, util.paramExtractor()),
  totalErrors: util.simpleQueryResponder(totalErrorsQuery, util.paramExtractor()),
  overviewErrors: function(scope) { return errorResponder(overallErrorQuery(scope)); },
  localityErrorsReport: util.simpleQueryResponder(localityErrors, util.paramExtractor()),
  scopedLocalityErrors: function(scope) { return errorResponder(getScopedLocalityErrors(scope), ['localityId']); }
}
