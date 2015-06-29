module.exports = {
  contestBallotCandidate: "SELECT can.*, (SELECT COUNT(v.*) \
                                          FROM validations v \
                                          WHERE v.scope='candidates' AND v.identifier = can.id AND v.results_id = can.results_id) \
                                          AS error_count \
                           FROM contests con \
                           LEFT JOIN ballot_candidates bc ON bc.ballot_id = con.ballot_id AND bc.results_id = con.results_id \
                           LEFT JOIN candidates can ON can.id = bc.candidate_id AND bc.results_id = can.results_id \
                           LEFT JOIN results r ON r.id=con.results_id \
                           WHERE r.public_id=$1 AND con.id=$2 AND can.id=$3;",
  contestBallotCandidates: "SELECT can.* \
                           FROM contests con \
                           LEFT JOIN ballot_candidates bc ON bc.ballot_id = con.ballot_id AND bc.results_id = con.results_id \
                           LEFT JOIN candidates can ON can.id = bc.candidate_id AND bc.results_id = can.results_id \
                           LEFT JOIN results r ON r.id=con.results_id \
                           WHERE r.public_id=$1 AND con.id=$2;"
}