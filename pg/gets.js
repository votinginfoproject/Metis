var conn = require('./conn.js');
var resp = require('./response.js');

module.exports = {
  // Functions below return arrays for the various queries with the requirement of an ID.
  getResults: function(req, res) {
    var client = conn.openPostgres();
    var query = client.query("SELECT * FROM results WHERE id=$1", [req.query.id]);

    query.on("row", function (row, result) {
      result.addRow(row);
    });

    conn.closePostgres(query, client, res);
  },
  getFeedContests: function(req, res) {
    var client = conn.openPostgres();
    var query = client.query("SELECT * FROM contests WHERE results_id=$1", [req.params.feedid]);

    query.on("row", function (row, result) {
      result.addRow(row);
    });

    conn.closePostgres(query, client, res);
  },
  getFeedContestsOverview: function(req, res) {
    var client = conn.openPostgres();
    var query = client.query("SELECT ballots_count, ballots_error_count, ballots_completion, candidates_count, candidates_error_count, candidates_completion, contests_count, contests_error_count, contests_completion, electoral_districts_count, electoral_districts_error_count, electoral_districts_completion, referendums_count, referendums_error_count, referendums_completion FROM statistics WHERE results_id=$1", [req.params.feedid]);

    query.on("row", function (row, result) {
      var tableData = [
        {element_type: 'Ballots',
         count: row.ballots_count,
         complete_pct: row.ballots_completion,
         error_count: row.ballots_error_count,
         link: '#/feeds/' + req.params.feedid + '/overview/ballots/errors'
        },
        {element_type: 'Candidates',
         count: row.candidates_count,
         complete_pct: row.candidates_completion,
         error_count: row.candidates_error_count,
         link: '#/feeds/' + req.params.feedid + '/overview/candidates/errors'
        },
        {element_type: 'Contests',
         count: row.contests_count,
         complete_pct: row.contests_completion,
         error_count: row.contests_error_count,
         link: '#/feeds/' + req.params.feedid + '/election/contests/errors'
        },
        {element_type: 'Electoral Districts',
         count: row.electoral_districts_count,
         complete_pct: row.electoral_districts_completion,
         error_count: row.electoral_districts_error_count,
         link: '#/feeds/' + req.params.feedid + '/overview/electoraldistricts/errors'
        },
        {element_type: 'Referendums',
         count: row.referendums_count,
         complete_pct: row.referendums_completion,
         error_count: row.referendums_error_count,
         link: '#/feeds/' + req.params.feedid + '/overview/referenda/errors'
        }
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
