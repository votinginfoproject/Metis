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
  feeds: "SELECT r.public_id, date(r.start_time) AS date, \
                 CASE WHEN r.end_time IS NOT NULL THEN r.end_time - r.start_time END AS duration, \
                 r.complete, s.name AS state, e.election_type, e.date \
          FROM results r \
          LEFT JOIN states s ON s.results_id = r.id \
          LEFT JOIN elections e ON e.results_id = r.id \
          ORDER BY r.start_time DESC;",
  results: "SELECT * FROM results WHERE public_id=$1",
  contest: "SELECT c.*, \
                   (SELECT COUNT(v.*) \
                    FROM validations v \
                    WHERE r.id = v.results_id AND v.scope = 'contests' AND v.identifier = $2) AS error_count \
            FROM contests c \
            INNER JOIN results r ON r.id = c.results_id \
            WHERE r.public_id=$1 AND c.id=$2;",
  contestBallot: "SELECT c.ballot_id, \
                         (SELECT COUNT(b.referendum_id) \
                          FROM ballots b \
                          WHERE b.id=c.ballot_id AND b.results_id = c.results_id) AS referendum_count, \
                         (SELECT COUNT(*) \
                          FROM ballot_candidates bc \
                          WHERE bc.results_id=c.results_id AND ballot_id=c.ballot_id) AS candidate_count \
                  FROM contests c \
                  INNER JOIN results r ON r.id=c.results_id \
                  WHERE r.public_id=$1 AND c.id=$2;",
  contestBallotReferendum: "SELECT ref.* \
                            FROM contests c \
                            LEFT JOIN ballots b ON b.id = c.ballot_id AND b.results_id = c.results_id \
                            INNER JOIN referendums ref ON ref.id = b.referendum_id AND ref.results_id = c.results_id \
                            LEFT JOIN results r ON r.id=c.results_id \
                            WHERE r.public_id=$1 AND c.id=$2;",
  contestBallotCustomBallot: "SELECT cb.* \
                              FROM contests c \
                              LEFT JOIN ballots b ON b.custom_ballot_id = c.ballot_id AND b.results_id = c.results_id \
                              LEFT JOIN custom_ballots cb ON cb.id = b.custom_ballot_id AND cb.results_id = c.results_id \
                              LEFT JOIN results r ON r.id=c.results_id \
                              WHERE r.public_id=$1 AND c.id=$2;",
  contestBallotCustomBallotResponses: "SELECT br.*, \
                                       (SELECT COUNT(v.*) \
                                        FROM validations v \
                                        WHERE v.results_id=c.results_id AND scope = 'ballot_responses' AND identifier = br.id) AS error_count \
                                       FROM contests c \
                                       LEFT JOIN ballots b ON b.custom_ballot_id = c.ballot_id AND b.results_id = c.results_id \
                                       LEFT JOIN custom_ballots cb ON cb.id = b.custom_ballot_id AND cb.results_id = c.results_id \
                                       LEFT JOIN custom_ballot_ballot_responses cbbc ON cbbc.custom_ballot_id = cb.id AND cbbc.results_id = c.results_id \
                                       LEFT JOIN ballot_responses br ON br.id = cbbc.ballot_response_id AND br.results_id = c.results_id \
                                       LEFT JOIN results r ON r.id=c.results_id \
                                       WHERE r.public_id=$1 AND c.id=$2;",
  contestElectoralDistrict: "SELECT c.electoral_district_id, e.name, \
                                    (SELECT COUNT(*) \
                                     FROM precinct_electoral_districts ped \
                                     WHERE ped.electoral_district_id = c.electoral_district_id) AS precinct_count, \
                                    (SELECT COUNT(*) \
                                     FROM precinct_split_electoral_districts psed \
                                     WHERE psed.electoral_district_id = c.electoral_district_id) AS precinct_split_count \
                             FROM contests c \
                             INNER JOIN electoral_districts e ON c.electoral_district_id = e.id \
                             INNER JOIN results r ON r.id = c.results_id \
                             WHERE r.public_id=$1 AND c.id=$2;",
  contestResult: "SELECT cr.id, cr.total_votes, cr.total_valid_votes, cr.overvotes, cr.blank_votes, cr.certification \
                  FROM contests c \
                  INNER JOIN contest_results cr ON cr.contest_id = c.id \
                  INNER JOIN results r ON r.id = c.results_id \
                  WHERE r.public_id=$1 AND c.id=$2;",
  contestBallotLineResults: "SELECT blr.id, blr.votes, blr.certification \
                             FROM contests c \
                             INNER JOIN ballot_line_results blr ON blr.contest_id = c.id \
                             INNER JOIN results r ON r.id = c.results_id \
                             WHERE r.public_id=$1 AND c.id=$2;",
  contests: "SELECT c.* \
             FROM contests c \
             INNER JOIN results r ON r.id = c.results_id \
             WHERE r.public_id=$1",
  localities: "SELECT l.id, l.name, COUNT(p.*) AS precincts \
               FROM localities l \
               INNER JOIN precincts p ON p.locality_id = l.id AND p.results_id = l.results_id \
               INNER JOIN results r ON l.results_id = r.id \
               WHERE r.public_id = $1 GROUP BY l.id, l.name, l.results_id \
               ORDER BY l.id;",
  state: "SELECT s.id, s.name, \
                 (SELECT COUNT(l.*) \
                  FROM localities l \
                  WHERE l.results_id = s.results_id) AS locality_count, \
                 (SELECT COUNT(v.*) \
                  FROM validations v \
                  WHERE v.results_id = s.results_id AND v.scope = 'states') AS error_count \
          FROM states s \
          INNER JOIN results r ON s.results_id = r.id \
          WHERE r.public_id = $1 GROUP BY s.id, s.name, s.results_id ORDER BY s.id;",
  electionAdministrations: "SELECT e.id, e.name, \
                                   CONCAT(e.physical_address_city, ', ', \
                                          e.physical_address_state, ', ', \
                                          e.physical_address_zip) AS address \
                            FROM election_administrations e \
                            INNER JOIN results r ON e.results_id = r.id \
                            WHERE r.public_id=$1;",
  election: "SELECT e.*, \
                    (SELECT COUNT(v.*) \
                     FROM validations v \
                     WHERE v.results_id = e.results_id AND scope='elections') AS error_count \
             FROM elections e \
             INNER JOIN results r ON r.id = e.results_id \
             WHERE r.public_id=$1",
  referendum: "SELECT ref.*, \
                      (SELECT COUNT(v.*) \
                       FROM validations v \
                       WHERE v.results_id = ref.results_id AND scope='referendums' AND identifier = ref.id) AS error_count \
               FROM referendums ref \
               INNER JOIN results r ON r.id = ref.results_id \
               WHERE r.public_id=$1 AND ref.id = $2;",
  referendumBallotResponses: "SELECT br.*, \
                                     (SELECT COUNT(v.*) \
                                      FROM validations v \
                                      WHERE v.results_id = br.results_id AND scope='ballot_responses' AND identifier = br.id) AS error_count \
                              FROM referendums ref \
                              INNER JOIN referendum_ballot_responses rbr ON ref.id = rbr.referendum_id AND rbr.results_id = ref.results_id \
                              INNER JOIN ballot_responses br ON br.id = rbr.ballot_response_id AND br.results_id = ref.results_id \
                              INNER JOIN results r ON r.id = ref.results_id \
                              WHERE r.public_id=$1 AND ref.id = $2;",
  source: "SELECT s.*, \
                  (SELECT COUNT(v.*) \
                   FROM validations v \
                   WHERE v.results_id = s.results_id AND scope='sources') AS error_count \
           FROM sources s \
           INNER JOIN results r ON r.id = s.results_id \
           WHERE r.public_id=$1",
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
                           WHERE r.public_id=$1 AND con.id=$2;",
  locality: "SELECT l.*, (SELECT COUNT(v.*) \
                          FROM validations v \
                          WHERE v.results_id = l.results_id AND v.scope = 'precincts' AND v.identifier = l.id) AS error_count \
             FROM localities l \
             LEFT JOIN results r ON r.id=l.results_id \
             WHERE r.public_id=$1 AND l.id=$2;",
  localityEarlyVoteSites: "SELECT evs.* \
                           FROM localities l \
                           INNER JOIN locality_early_vote_sites levs ON levs.locality_id = l.id AND levs.results_id = l.results_id \
                           INNER JOIN early_vote_sites evs ON evs.id = levs.early_vote_site_id AND evs.results_id = l.results_id \
                           INNER JOIN results r ON r.id = l.results_id \
                           WHERE r.public_id=$1 AND l.id=$2;",
  localityElectionAdministration: "SELECT ea.* \
                                   FROM localities l \
                                   INNER JOIN election_administrations ea ON ea.id = l.election_administration_id AND ea.results_id = l.results_id \
                                   INNER JOIN results r ON r.id = l.results_id \
                                   WHERE r.public_id=$1 AND l.id=$2;",
  localityPrecincts: "SELECT p.id, p.name, COUNT(ps.*) AS precinct_splits \
                      FROM localities l \
                      INNER JOIN precincts p ON p.locality_id = l.id AND p.results_id = l.results_id \
                      INNER JOIN precinct_splits ps ON ps.precinct_id = p.id AND ps.results_id = l.results_id \
                      INNER JOIN results r ON r.id = l.results_id \
                      WHERE r.public_id=$1 AND l.id=$2 \
                      GROUP BY p.id, p.name",
  localityOverviewEarlyVoteSites: "SELECT (CASE COUNT(evs.*) \
                                           WHEN 0 THEN 100 \
                                           ELSE (COUNT(evs.*) - COUNT(v.*)) / COUNT(evs.*)::float * 100 END) AS completion, \
                                           COUNT(evs.*) AS count, \
                                           COUNT(v.*) AS error_count \
                                   FROM localities l \
                                   INNER JOIN locality_early_vote_sites levs ON levs.locality_id = l.id AND levs.results_id = l.results_id \
                                   INNER JOIN early_vote_sites evs ON evs.id = levs.early_vote_site_id AND evs.results_id = l.results_id \
                                   INNER JOIN validations v ON v.results_id = l.results_id AND v.scope = 'early-vote-sites' AND v.identifier = evs.id \
                                   INNER JOIN results r ON r.id = l.results_id \
                                   WHERE r.public_id=$1 AND l.id=$2;",
  localityOverviewElectionAdministrations: "SELECT (CASE COUNT(ea.*) \
                                                    WHEN 0 THEN 100 \
                                                    ELSE (COUNT(ea.*) - COUNT(v.*)) / COUNT(ea.*)::float * 100 END) AS completion, \
                                                    COUNT(ea.*) AS count, \
                                                    COUNT(v.*) AS error_count \
                                            FROM localities l \
                                            INNER JOIN election_administrations ea ON ea.id = l.election_administration_id AND ea.results_id = l.results_id \
                                            INNER JOIN validations v ON v.results_id = l.results_id AND v.scope = 'election-administrations' AND v.identifier = ea.id \
                                            INNER JOIN results r ON r.id = l.results_id \
                                            WHERE r.public_id=$1 AND l.id=$2;",
  localityOverviewPollingLocations: "SELECT (CASE COUNT(pl.*) \
                                             WHEN 0 THEN 100 \
                                             ELSE (COUNT(pl.*) - COUNT(v.*)) / COUNT(pl.*)::float * 100 END) AS completion, \
                                             COUNT(pl.*) AS count, \
                                             COUNT(v.*) AS error_count \
                                     FROM localities l \
                                     INNER JOIN precincts p ON p.locality_id = l.id AND p.results_id = l.results_id \
                                     INNER JOIN precinct_splits ps ON ps.precinct_id = p.id AND ps.results_id = l.results_id \
                                     INNER JOIN precinct_polling_locations ppl ON ppl.precinct_id = p.id AND ppl.results_id = l.results_id \
                                     INNER JOIN precinct_split_polling_locations pspl ON pspl.precinct_split_id = ps.id AND pspl.results_id = l.results_id \
                                     INNER JOIN polling_locations pl ON (pl.id = ppl.polling_location_id OR pl.id = pspl.polling_location_id) AND pl.results_id = l.results_id \
                                     INNER JOIN validations v ON v.results_id = l.results_id AND v.scope = 'polling-locations' AND identifier = pl.id \
                                     INNER JOIN results r ON r.id = l.results_id \
                                     WHERE r.public_id=$1 AND l.id=$2;",
  localityOverviewPrecincts: "SELECT (CASE COUNT(p.*) \
                                      WHEN 0 THEN 100 \
                                      ELSE (COUNT(p.*) - COUNT(v.*)) / COUNT(p.*)::float * 100 END) AS completion, \
                                      COUNT(p.*) AS count, \
                                      COUNT(v.*) AS error_count \
                              FROM localities l \
                              INNER JOIN precincts p ON p.locality_id = l.id AND p.results_id = l.results_id \
                              INNER JOIN validations v ON v.results_id = l.results_id AND v.scope = 'precincts' AND identifier = p.id \
                              INNER JOIN results r ON r.id = l.results_id \
                              WHERE r.public_id=$1 AND l.id=$2;",
  localityOverviewPrecinctSplits: "SELECT (CASE COUNT(ps.*) \
                                           WHEN 0 THEN 100 \
                                           ELSE (COUNT(ps.*) - COUNT(v.*)) / COUNT(ps.*)::float * 100 END) AS completion, \
                                           COUNT(ps.*) AS count, \
                                           COUNT(v.*) AS error_count \
                                   FROM localities l \
                                   INNER JOIN precincts p ON p.locality_id = l.id AND p.results_id = l.results_id \
                                   INNER JOIN precinct_splits ps ON ps.precinct_id = p.id AND ps.results_id = l.results_id \
                                   INNER JOIN validations v ON v.results_id = l.results_id AND v.scope = 'precinct-splits' AND identifier = ps.id \
                                   INNER JOIN results r ON r.id = l.results_id \
                                   WHERE r.public_id=$1 AND l.id=$2;",
  localityOverviewStreetSegments: "SELECT (CASE COUNT(ss.*) \
                                           WHEN 0 THEN 100 \
                                           ELSE (COUNT(ss.*) - COUNT(v.*)) / COUNT(ss.*)::float * 100 END) AS completion, \
                                           COUNT(ss.*) AS count, \
                                           COUNT(v.*) AS error_count \
                                   FROM localities l \
                                   INNER JOIN precincts p ON p.locality_id = l.id AND p.results_id = l.results_id \
                                   INNER JOIN street_segments ss ON ss.precinct_id = p.id AND ss.results_id = l.results_id \
                                   INNER JOIN validations v ON v.results_id = l.results_id AND v.scope = 'street-segments' AND v.identifier = ss.id \
                                   INNER JOIN results r ON r.id = l.results_id \
                                   WHERE r.public_id=$1 AND l.id=$2;",

  // errors
  overallErrorQuery: function(scope) { return buildErrorQuery("", "v.scope = '" + scope  +"'"); },
  contestBallotErrors: buildErrorQuery("INNER JOIN contests c ON v.identifier = c.ballot_id AND c.results_id = v.results_id",
                                       "v.scope = 'ballots' AND c.id = $2"),
  contestErrors: buildErrorQuery("INNER JOIN contests c ON v.identifier = c.id AND c.results_id = v.results_id",
                                 "v.scope = 'contests' AND c.id = $2"),
  errors: buildErrorQuery("", "")
}
