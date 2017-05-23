var conn = require('./conn.js');
var logger = (require('../logging/vip-winston')).Logger;

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

    try {
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

        query.on("error", function(e) {
          logger.error("Generating an error report for '" + feedid + "' caused " + e.message);
          // If the query doesn't return anything before we hit our connection's
          // timeout, we'll only have added CSV headers to the response.
          res.end();
        });
      });
    }
    catch (e) {}
  }
}

var xmlTreeValidationQuery =
"SELECT v.severity, v.scope, v.path, x.value AS identifier, \
        v.error_type, v.error_data \
 FROM xml_tree_validations v \
 LEFT JOIN xml_tree_values x \
        ON x.path = subpath(v.path,0,4) || 'id' AND x.results_id = v.results_id \
 INNER JOIN results r ON r.id = v.results_id \
 WHERE r.public_id = $1";

var scopedXmlTreeValidationQuery = function(elementTypes) {
  return "SELECT v.severity, v.scope, v.path, x.value AS identifier, \
        v.error_type, v.error_data \
 FROM xml_tree_validations v \
 LEFT JOIN xml_tree_values x \
        ON x.path = subpath(v.path,0,4) || 'id' AND x.results_id = v.results_id \
 INNER JOIN results r ON r.id = v.results_id \
 WHERE r.public_id = $1 AND v.path ~ 'VipObject.0." + elementTypes.join("|") + ".*'";
}

var scopedXmlTreeValidationErrorReport = function() {
  var elementTypes = Array.prototype.slice.call(arguments);

  return function(req, res) {
    var header = ["Feed", "Severity", "Scope", "Path", "ID", "Error Type", "Error Data"];
    var feedid = decodeURIComponent(req.params.feedid);

    conn.query(function(client) {
      res.header("Content-Disposition", "attachment; filename=" + csvFilename(feedid, elementTypes[0]));
      res.setHeader('Content-type', 'text/csv');
      res.charset = 'UTF-8';

      res.write(makeCSVRow(header));

      var query = client.query(scopedXmlTreeValidationQuery(elementTypes), [feedid]);

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
  };
}

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

var xmlTreeLocalityErrorReport = function(req, res) {
  var header = ["Feed", "Severity", "Scope", "Path", "ID", "Error Type", "Error Data"];
  var feedid = decodeURIComponent(req.params.feedid);
  var localityid = decodeURIComponent(req.params.localityId)
  conn.query(function(client) {

    res.header("Content-Disposition", "attachment; filename=" + csvFilename(feedid));
    res.setHeader('Content-type', 'text/csv');
    res.charset = 'UTF-8';

    res.write(makeCSVRow(header));

    var query = client.query('select * from v5_dashboard.locality_error_report($1, $2)', [feedid, localityid]);

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

var pollingLocationAddressReport = function(req, res) {
  var header = ["Locality Name", "Precinct Name", "Address Location Name", "Address Line 1", "Address Line 2", "Address Line 3", "Address City", "Address State",  "Address Zip", "Polling Location Id"];
  var feedid = decodeURIComponent(req.params.feedid);
  conn.query(function(client) {

    res.header("Content-Disposition", "attachment; filename=" + csvFilename(feedid));
    res.setHeader('Content-type', 'text/csv');
    res.charset = 'UTF-8';

    res.write(makeCSVRow(header));

    var query = client.query('select * from v3_dashboard.polling_location_readable_report($1)', [feedid]);

    query.on("row", function(row, result) {
      res.write(makeCSVRow([row.locality_name,
                            row.precinct_name,
                            row.address_location_name,
                            row.address_line1,
                            row.address_line2,
                            row.address_line3,
                            row.address_city,
                            row.address_state,
                            row.address_zip,
                            row.polling_location_id]));
    });

    query.on("end", function(result) {
      res.end();
    });
  });

}

module.exports = {
  xmlTreeLocalityErrorReport: xmlTreeLocalityErrorReport,
  errorReport: errorReport,
  fullErrorReport: errorReport("", "", []),
  scopedErrorReport: function(scope) {
    return errorReport("", "v.scope = '" + scope + "'", [], scope);
  },
  xmlTreeValidationErrorReport: xmlTreeValidationErrorReport,
  scopedXmlTreeValidationErrorReport: scopedXmlTreeValidationErrorReport,
  pollingLocationAddressReport: pollingLocationAddressReport
}
