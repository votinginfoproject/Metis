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
  var wherePart;
  if (wheres) {
    wherePart = "AND " + wheres;
  }
  return "SELECT DISTINCT ON (severity, scope, error_type) severity, scope, error_type, identifier, error_data, count \
          FROM (SELECT DISTINCT COUNT(1) OVER (PARTITION BY v.results_id, v.severity, v.scope, v.error_type), \
                       v.scope, v.error_type, v.identifier, v.error_data, v.severity \
                FROM validations v \
                INNER JOIN results r ON r.id = v.results_id " +
          joins +
         " WHERE r.public_id = $1 " + wherePart + ") as errors";
}

module.exports = {

  // errors
  ballotErrors: buildErrorQuery("", "scope = 'ballots'"),
  contestBallotErrors: buildErrorQuery("INNER JOIN contests c ON v.identifier = c.ballot_id AND c.results_id = v.results_id",
                                       "v.scope = 'ballots' AND c.id = $2")
}
