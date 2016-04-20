var conn = require('./conn.js');

var endOfLine = require('os').EOL;
var delim = ',';

var makeCSVSafe = function(value){
  value = value && value.toString() || '';
  // the delim is in our value we need to put quotes around our value
  if(value.indexOf(delim)!==-1){

    // if we are putting quotes around our value, we need to escape any existing quotes first
    value = value.replace(/"/g, '""');

    value = '"' + value + '"';
  }

  return value;
}

var makeCSVRow = function(values) {
  return values.map(makeCSVSafe).join(delim) + endOfLine;
}

var header = ["Feed", "Severity", "Scope", "ID", "Error Type", "Error Data"];

var csvFilename = function(feedId, scope) {
  scopeName = scope || "Full";
  return feedId.replace(/ /g, '-') + "-" + scopeName + "ErrorReport.csv";
}

var errorReport = function(innerJoins, where, params, scope) {
  var errorQuery = "SELECT v.* FROM validations v INNER JOIN results r ON r.id = v.results_id " +
      innerJoins +
      " WHERE r.public_id=$1 " +
      (where ? " AND " + where : "") +
      " ORDER BY v.scope, v.identifier";
  return function(req, res) {
    var feedid = decodeURIComponent(req.params.feedid);

    conn.query(function(client) {
      var queryParams = ['feedid'].concat(params).map(function(param) { return decodeURIComponent(req.params[param]); });

      res.header("Content-Disposition", "attachment; filename=" + csvFilename(feedid, scope));
      res.setHeader('Content-type', 'text/csv');
      res.charset = 'UTF-8';

      res.write(makeCSVRow(header));

      var query = client.query(errorQuery, queryParams);

      query.on("row", function(row, result) {
        res.write(makeCSVRow([feedid, row.severity, row.scope, row.identifier, row.error_type, row.error_data]));
      });

      query.on("end", function(result) {
        res.end();
      });
    });
  }
}

var xmlTreeValidationQuery =
"SELECT v.severity, v.scope, v.path, x.value AS identifier, \
        v.error_type, v.error_data \
 FROM xml_tree_validations v \
 LEFT JOIN xml_tree_values x \
        ON x.path = subpath(v.path,0,4) || 'id' AND x.results_id = v.results_id \
 WHERE v.results_id = $1";

var xmlTreeValidationErrorReport = function(req, res) {
  var header = ["Feed", "Severity", "Scope", "Path", "ID", "Error Type", "Error Data"];
  var feedid = decodeURIComponent(req.params.feedid);

  conn.query(function(client) {
    res.header("Content-Disposition", "attachment; filename=" + csvFilename(feedid));
    res.setHeader('Content-type', 'text/csv');
    res.charset = 'UTF-8';

    res.write(makeCSVRow(header));

    var query = client.query(xmlTreeValidationQuery, [feedid]);

    query.on("row", function(row, result) {
      res.write(makeCSVRow([feedid,
                            row.severity,
                            row.scope,
                            row.path,
                            row.identifier,
                            row.error_type,
                            row.error_data]));
    });

    query.on("end", function(result) {
      res.end();
    });
  });
}

module.exports = {
  errorReport: errorReport,
  fullErrorReport: errorReport("", "", []),
  scopedErrorReport: function(scope) {
    return errorReport("", "v.scope = '" + scope + "'", [], scope);
  },
  xmlTreeValidationErrorReport: xmlTreeValidationErrorReport
}
