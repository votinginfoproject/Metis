/*
   Build a query for validation errors based on joins and a where
   clause. The validations table will be aliased as `v`. Where clauses
   should use parameters starting at `$2`, as `$1` will be used by the
   `public_id`.

   For example: buildErrorQuery("INNER JOIN ballots b ON b.results_id = v.results_id AND b.id = v.identifier",
                                "b.id = $2 AND scope = 'ballots'");

   That will get a count of all error types for a specific ballot and
   example error data for each error type.
*/
var buildErrorQuery = function(joins, wheres) {
  var wherePart = "";
  if (wheres) {
    wherePart = "AND " + wheres;
  }
  return "SELECT DISTINCT ON (v.severity, v.scope, v.error_type) \
                 COUNT(1), v.severity, v.scope, v.error_type, (array_agg(v.identifier))[1] AS identifier, (array_agg(v.error_data))[1] AS error_data \
          FROM validations v \
          INNER JOIN results r ON r.id = v.results_id " +
         joins +
         " WHERE r.public_id = $1 " + wherePart +
         " GROUP BY v.severity, v.scope, v.error_type";
}

module.exports = {

  // errors
  overallErrorQuery: function(scope) { return buildErrorQuery("", "v.scope = '" + scope  +"'"); },
  contestBallotErrors: buildErrorQuery("INNER JOIN contests c ON v.identifier = c.ballot_id AND c.results_id = v.results_id",
                                       "v.scope = 'ballots' AND c.id = $2"),
  errors: buildErrorQuery("", ""),
}
