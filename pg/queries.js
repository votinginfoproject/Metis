module.exports = {

  // errors
  ballotErrors: "SELECT v.severity, v.scope, v.error_type, COUNT(v.*) \
                 FROM validations v \
                 INNER JOIN results r ON r.id = v.results_id \
                 WHERE r.public_id = $1 AND scope = 'ballots' \
                 GROUP BY v.error_type, v.severity, v.scope;",
  ballotErrorExample: "SELECT v.identifier, v.error_type, v.error_data \
                       FROM validations v \
                       INNER JOIN results r ON r.id = v.results_id \
                       WHERE v.scope = 'ballots' AND r.public_id = $1 AND v.error_type = $2 \
                       LIMIT 1;",
  contestBallotErrors: "SELECT v.severity, v.scope, v.error_type, COUNT(v.*) \
                        FROM validations v \
                        INNER JOIN contests c ON v.identifier = c.ballot_id AND c.results_id = v.results_id \
                        INNER JOIN results r ON r.id = v.results_id \
                        WHERE v.scope = 'ballots' AND r.public_id = $1 AND c.id = $2 \
                        GROUP BY v.error_type, v.severity, v.scope;",
  contestBallotErrorExample: "SELECT v.identifier, v.error_type, v.error_data \
                              FROM validations v \
                              INNER JOIN contests c ON v.identifier = c.ballot_id AND c.results_id = v.results_id \
                              INNER JOIN results r ON r.id = v.results_id \
                              WHERE v.scope = 'ballots' AND r.public_id = $1 AND c.id = $2 AND v.error_type = $3 \
                              LIMIT 1;"
}
