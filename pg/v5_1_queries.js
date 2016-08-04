var conn = require('./conn.js');
var queries = require('./queries.js');
var resp = require('./response.js');
var util = require('./util.js');

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

var errorSummary = "SELECT DISTINCT ON (v.severity, v.scope, v.error_type) \
                    COUNT(1), v.severity, v.scope, v.error_type, (array_agg(v.path))[1] AS path, (array_agg(v.error_data))[1] AS error_data \
                    FROM xml_tree_validations v \
                    INNER JOIN results r ON r.id = v.results_id \
                    WHERE r.public_id = $1 \
                    GROUP BY v.severity, v.scope, v.error_type;"

var overviewTableRow = function(row, type, dbTable, link) {
  return {element_type: type,
          count: row[dbTable + '_count'],
          complete_pct: row[dbTable + '_completion'],
          error_count: row[dbTable + '_errors'],
          link: link};
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
                             overviewTableRow(row, 'State', 'state', '#/5.1/feeds/' + feedid + '/overview/states/errors'),
                             overviewTableRow(row, 'Precincts', 'precinct', '#/5.1/feeds/' + feedid + '/overview/precincts/errors'),
                             overviewTableRow(row, 'Polling Location', 'polling_location', '#/5.1/feeds/' + feedid + '/overview/polling_locations/errors'),
                             overviewTableRow(row, 'Localities', 'locality', '#/5.1/feeds/' + feedid + '/overview/localities/errors'),
                             overviewTableRow(row, 'Hours Open', 'hours_open', '#/5.1/feeds/' + feedid + '/overview/hours_open/errors')
                           ],
                         };
                       resp.writeResponse(summaries, res);
                     }
                 });
  });
};

module.exports = {
  errorSummary: util.simpleQueryResponder(errorSummary, util.paramExtractor()),
  feedOverview: util.simpleQueryResponder(overviewQuery, util.paramExtractor()),
  feedOverviewSummaryData: getFeedOverviewSummaryData,
  totalErrors: util.simpleQueryResponder(totalErrorsQuery, util.paramExtractor()),
}
