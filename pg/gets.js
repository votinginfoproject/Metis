var conn = require('./conn.js');
var resp = require('./response.js');

var overviewTableRow = function(row, type, dbTable, link) {
  return {element_type: type,
          count: row[dbTable + '_count'],
          complete_pct: row[dbTable + '_completion'],
          error_count: row[dbTable + '_error_count'],
          link: link};
}

var simpleQueryResponder = function(sqlQuery, paramsFn) {
  return function(req, res) {
    var client = conn.openPostgres();
    var query = client.query(sqlQuery, paramsFn(req));

    query.on("row", function (row, result) {
      result.addRow(row);
    });

    conn.closePostgres(query, client, res);
  }
}

module.exports = {
  // Functions below return arrays for the various queries with the requirement of an ID.
  getResults: simpleQueryResponder("SELECT * FROM results WHERE id=$1", function(req) { return [req.query.id]; }),
  getFeedContests: simpleQueryResponder("SELECT * FROM contests WHERE results_id=$1", function(req) { return [req.params.feedid]; }),
  getFeedLocalities: simpleQueryResponder("SELECT l.id, l.name, COUNT(p.*) AS precincts, CONCAT('#/feeds/', l.results_id, '/election/state/localities/', l.id) as link FROM localities l INNER JOIN precincts p ON p.locality_id = l.id AND p.results_id = l.results_id WHERE l.results_id = $1 GROUP BY l.id, l.name, l.results_id ORDER BY l.id;", function(req) { return [req.params.feedid]; }),
  getFeedState: simpleQueryResponder("SELECT s.id, s.name, (SELECT COUNT(l.*) FROM localities l WHERE l.results_id = $1) AS locality_count, (SELECT COUNT(v.*) FROM validations v WHERE v.result_id = $1 AND v.scope = 'states') AS error_count FROM states s WHERE s.results_id = $1 GROUP BY s.id, s.name ORDER BY s.id;", function(req) { return [req.params.feedid]; }),
  getFeedOverview: function(req, res) {
    var client = conn.openPostgres();
    var feedid = req.params.feedid;
    var query = client.query("SELECT * FROM statistics WHERE results_id=$1", [feedid]);

    query.on("row", function (row, result) {
      var tables = {
        pollingLocations: [
          overviewTableRow(row, 'Early Vote Sites', 'early_vote_sites', '#/feeds/' + feedid + '/overview/earlyvotesites/errors'),
          overviewTableRow(row, 'Election Adminitrations', 'election_administrations', '#/feeds/' + feedid + '/overview/electionadministrations/errors'),
          overviewTableRow(row, 'Election Officials', 'election_officials', '#/feeds/' + feedid + '/overview/electionofficials/errors'),
          overviewTableRow(row, 'Localities', 'localities', '#/feeds/' + feedid + '/overview/localities/errors'),
          overviewTableRow(row, 'Polling Locations', 'polling_locations', '#/feeds/' + feedid + '/overview/pollinglocations/errors'),
          overviewTableRow(row, 'Precinct Splits', 'precinct_splits', '#/feeds/' + feedid + '/overview/precinctsplits/errors'),
          overviewTableRow(row, 'Precincts', 'precincts', '#/feeds/' + feedid + '/overview/precincts/errors'),
          overviewTableRow(row, 'Street Segments', 'street_segments', '#/feeds/' + feedid + '/overview/streetsegments/errors')
        ],
        contests: [
          overviewTableRow(row, 'Ballots', 'ballots', '#/feeds/' + feedid + '/overview/ballots/errors'),
          overviewTableRow(row, 'Candidates', 'candidates', '#/feeds/' + feedid + '/overview/candidates/errors'),
          overviewTableRow(row, 'Contests', 'contests', '#/feeds/' + feedid + '/election/contests/errors'),
          overviewTableRow(row, 'Electoral Districts', 'electoral_districts', '#/feeds/' + feedid + '/overview/electoraldistricts/errors'),
          overviewTableRow(row, 'Referenda', 'referendums', '#/feeds/' + feedid + '/overview/referenda/errors')
        ],
        source: overviewTableRow(row, 'Source', 'sources', '#/feeds/' + feedid + '/source/errors'),
        election: overviewTableRow(row, 'Election', 'elections', '#/feeds/' + feedid + '/election/errors')
      };
      result.addRow(tables);
    });

    conn.closePostgres(query, client, res);
  },
  getFeedContestsOverview: function(req, res) {
    var client = conn.openPostgres();
    var feedid = req.params.feedid;
    var query = client.query("SELECT ballots_count, ballots_error_count, ballots_completion, candidates_count, candidates_error_count, candidates_completion, contests_count, contests_error_count, contests_completion, electoral_districts_count, electoral_districts_error_count, electoral_districts_completion, referendums_count, referendums_error_count, referendums_completion FROM statistics WHERE results_id=$1", [feedid]);

    query.on("row", function (row, result) {
      var tableData = [
        overviewTableRow(row, 'Ballots', 'ballots', '#/feeds/' + feedid + '/overview/ballots/errors'),
        overviewTableRow(row, 'Candidates', 'candidates', '#/feeds/' + feedid + '/overview/candidates/errors'),
        overviewTableRow(row, 'Contests', 'contests', '#/feeds/' + feedid + '/election/contests/errors'),
        overviewTableRow(row, 'Electoral Districts', 'electoral_districts', '#/feeds/' + feedid + '/overview/electoraldistricts/errors'),
        overviewTableRow(row, 'Referenda', 'referendums', '#/feeds/' + feedid + '/overview/referenda/errors')
      ];
      result.addRow(tableData);
    });

    conn.closePostgres(query, client, res);
  },
  getValidations: function(req, res) {
    var client = conn.openPostgres();
    var query = client.query("SELECT * FROM validations WHERE result_id=$1", [req.query.id]);

    query.on("row", function (row, result) {
      result.addRow(row);
    });

    query.on("end", function (result) {
      var edn = require("jsedn");

      for (i = 0; i < result.rows.length; i++) {
        var parsed_message = edn.toJS(edn.parse(result.rows[i]["message"]));
        result.rows[i]["message"] = parsed_message;
      }

      client.end();
      resp.writeResponse(result.rows, res)
    });
  },
  getValidationsErrorCount: function(req, res) {
    var client = conn.openPostgres();
    var query = client.query("SELECT message FROM validations WHERE result_id=$1", [req.query.id]);

    query.on("row", function (row, result) {
      result.addRow(row);
    });

    query.on("end", function (result) {
      var edn = require("jsedn");
      var count = 0;

      for (i = 0; i < result.rows.length; i++) {
        var parsed_message = edn.toJS(edn.parse(result.rows[i]["message"]));
        count += parsed_message.length || 1;
      }

      client.end();
      resp.writeResponse(count, res)
    });
  }
}
