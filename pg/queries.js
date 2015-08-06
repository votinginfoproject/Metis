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
  feeds: "SELECT r.public_id, date(r.start_time) AS start_time, date(r.end_time) AS end_time, \
                 CASE WHEN r.end_time IS NOT NULL THEN r.end_time - r.start_time END AS duration, \
                 r.complete, s.name AS state, e.election_type, date(e.date) AS election_date \
          FROM results r \
          LEFT JOIN states s ON s.results_id = r.id \
          LEFT JOIN elections e ON e.results_id = r.id \
          ORDER BY r.start_time DESC;",
  results: "SELECT * FROM results WHERE public_id=$1",
  errorsTotal: "SELECT COUNT(v.*)::int \
                FROM validations v \
                INNER JOIN results r ON r.id = v.results_id \
                WHERE r.public_id = $1",
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
  contestElectoralDistrict: "SELECT ed.*, \
                                    (SELECT COUNT(v.*) \
                                     FROM validations v \
                                     WHERE v.results_id = c.results_id AND scope = 'electoral-districts' AND identifier = ed.id) AS error_count, \
                                    (SELECT COUNT(ped.*) \
                                     FROM precinct_electoral_districts ped \
                                     WHERE ped.results_id = c.results_id AND ped.electoral_district_id = ed.id) AS precinct_count, \
                                    (SELECT COUNT(psed.*) \
                                     FROM precinct_split_electoral_districts psed \
                                     WHERE psed.results_id = c.results_id AND psed.electoral_district_id = ed.id) AS precinct_split_count \
                      FROM contests c \
                      INNER JOIN electoral_districts ed ON ed.id = c.electoral_district_id \
                      INNER JOIN results r ON r.id = c.results_id \
                      WHERE r.public_id = $1 AND c.id = $2;",
  contestElectoralDistrictPrecincts: "SELECT p.id, p.name, p.locality_id, COUNT(ps.*) AS precinct_splits \
                                      FROM contests c \
                                      INNER JOIN electoral_districts ed ON c.electoral_district_id = ed.id AND ed.results_id = c.results_id \
                                      INNER JOIN precinct_electoral_districts ped ON ped.electoral_district_id = ed.id AND ped.results_id = c.results_id \
                                      INNER JOIN precincts p ON p.id = ped.precinct_id AND p.results_id = c.results_id \
                                      INNER JOIN precinct_split_electoral_districts psed ON psed.electoral_district_id = ed.id AND psed.results_id = c.results_id \
                                      INNER JOIN precinct_splits ps ON ps.id = psed.precinct_split_id AND ps.results_id = c.results_id \
                                      INNER JOIN results r ON r.id = c.results_id \
                                      WHERE r.public_id = $1 AND c.id = $2 \
                                      GROUP BY p.id, p.name, p.locality_id;",
  contestElectoralDistrictPrecinctSplits: "SELECT ps.id, ps.name, p.id AS precinct_id, p.locality_id AS locality_id, COUNT(ss.*) AS street_segments \
                                           FROM contests c \
                                           INNER JOIN electoral_districts ed ON c.electoral_district_id = ed.id AND ed.results_id = c.results_id \
                                           INNER JOIN precinct_split_electoral_districts psed ON psed.electoral_district_id = ed.id AND psed.results_id = c.results_id \
                                           INNER JOIN precinct_splits ps ON ps.id = psed.precinct_split_id AND ps.results_id = c.results_id \
                                           INNER JOIN precincts p ON p.id = ps.precinct_id AND p.results_id = c.results_id \
                                           INNER JOIN street_segments ss ON ss.precinct_split_id = ps.id AND ss.results_id = c.results_id \
                                           INNER JOIN results r ON r.id = c.results_id \
                                           WHERE r.public_id = $1 AND c.id = $2 \
                                           GROUP BY ps.id, ps.name, p.id, p.locality_id;",
  contests: "SELECT c.* \
             FROM contests c \
             INNER JOIN results r ON r.id = c.results_id \
             WHERE r.public_id=$1",
  localities: "SELECT l.*, \
                      (SELECT COUNT(p.*)::int \
                       FROM precincts p \
                       WHERE p.locality_id = l.id AND p.results_id = l.results_id) AS precincts \
               FROM localities l \
               INNER JOIN results r ON l.results_id = r.id \
               WHERE r.public_id = $1 \
               GROUP BY l.id, l.results_id;",
  state: "SELECT s.id, s.name, \
                 (SELECT COUNT(l.*)::int \
                  FROM localities l \
                  WHERE l.results_id = s.results_id) AS locality_count, \
                 (SELECT COUNT(v.*)::int \
                  FROM validations v \
                  WHERE v.results_id = s.results_id AND v.scope = 'states') AS error_count \
          FROM states s \
          INNER JOIN results r ON s.results_id = r.id \
          WHERE r.public_id = $1 GROUP BY s.id, s.name, s.results_id ORDER BY s.id;",
  stateElectionAdministration: "SELECT ea.*, \
                                       CONCAT(ea.physical_address_city, ', ', \
                                              ea.physical_address_state, ', ', \
                                              ea.physical_address_zip) AS address, \
                                       (SELECT l.id \
                                        FROM localities l \
                                        WHERE l.election_administration_id = ea.id AND l.results_id = s.results_id) AS locality_id, \
                                       (SELECT COUNT(v.*) \
                                        FROM validations v \
                                        WHERE v.results_id = ea.results_id AND v.scope = 'election-administrations' AND v.identifier = ea.id) AS error_count \
                                FROM states s \
                                INNER JOIN election_administrations ea ON s.election_administration_id = ea.id AND ea.results_id = s.results_id \
                                INNER JOIN results r ON s.results_id = r.id \
                                WHERE r.public_id=$1;",
  electionAdministrations: "SELECT e.*, l.id AS locality_id, \
                                   CONCAT(e.physical_address_city, ', ', \
                                          e.physical_address_state, ', ', \
                                          e.physical_address_zip) AS address \
                            FROM election_administrations e \
                            INNER JOIN localities l ON l.election_administration_id = e.id AND l.results_id = e.results_id \
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
  contestOverviewBallot: "SELECT (CASE COUNT(b.*) \
                                  WHEN 0 THEN 100 \
                                  ELSE (COUNT(b.*) - COUNT(v.*)) / COUNT(b.*)::float * 100 END) AS completion, \
                                  COUNT(b.*) AS count, \
                                  COUNT(v.*) AS error_count \
                          FROM contests c \
                          INNER JOIN ballots b ON b.id = c.ballot_id AND b.results_id = c.results_id \
                          INNER JOIN validations v ON v.results_id = c.results_id AND v.scope = 'ballots' AND v.identifier = b.id \
                          INNER JOIN results r ON r.id = c.results_id \
                          WHERE r.public_id=$1 AND c.id=$2;",
  contestOverviewReferendum: "SELECT (CASE COUNT(b.*) \
                                      WHEN 0 THEN 100 \
                                      ELSE (COUNT(b.*) - COUNT(v.*)) / COUNT(b.*)::float * 100 END) AS completion, \
                                      COUNT(b.*) AS count, \
                                      COUNT(v.*) AS error_count \
                              FROM contests c \
                              INNER JOIN ballots b ON b.id = c.ballot_id AND b.results_id = c.results_id \
                              INNER JOIN referendums ref ON ref.id = b.referendum_id AND ref.results_id = c.results_id \
                              INNER JOIN validations v ON v.results_id = c.results_id AND v.scope = 'referendums' AND v.identifier = b.id \
                              INNER JOIN results r ON r.id = c.results_id \
                              WHERE r.public_id=$1 AND c.id=$2;",
  contestOverviewCandidates: "SELECT (CASE COUNT(can.*) \
                                      WHEN 0 THEN 100 \
                                      ELSE (COUNT(can.*) - COUNT(v.*)) / COUNT(can.*)::float * 100 END) AS completion, \
                                      COUNT(can.*) AS count, \
                                      COUNT(v.*) AS error_count \
                              FROM contests c \
                              INNER JOIN ballots b ON b.id = c.ballot_id AND b.results_id = c.results_id \
                              INNER JOIN ballot_candidates bc ON bc.ballot_id = b.id AND bc.results_id = c.results_id \
                              INNER JOIN candidates can ON can.id = bc.candidate_id AND can.results_id = c.results_id \
                              INNER JOIN validations v ON v.results_id = c.results_id AND v.scope = 'candidates' AND v.identifier = can.id \
                              INNER JOIN results r ON r.id = c.results_id \
                              WHERE r.public_id=$1 AND c.id=$2;",
  contestOverviewElectoralDistrict: "SELECT (CASE COUNT(ed.*) \
                                             WHEN 0 THEN 100 \
                                             ELSE (COUNT(ed.*) - COUNT(v.*)) / COUNT(ed.*)::float * 100 END) AS completion, \
                                             COUNT(ed.*) AS count, \
                                             COUNT(v.*) AS error_count \
                                     FROM contests c \
                                     INNER JOIN electoral_districts ed ON ed.id = c.electoral_district_id AND ed.results_id = c.results_id \
                                     INNER JOIN validations v ON v.results_id = c.results_id AND v.scope = 'electoral-districts' AND v.identifier = ed.id \
                                     INNER JOIN results r ON r.id = c.results_id \
                                     WHERE r.public_id=$1 AND c.id=$2;",

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
  localityElectionAdministrationElectionOfficial: "SELECT eo.* \
                                                   FROM localities l \
                                                   INNER JOIN election_administrations ea ON ea.id = l.election_administration_id AND ea.results_id = l.results_id \
                                                   INNER JOIN election_officials eo ON eo.id = ea.eo_id AND eo.results_id = l.results_id \
                                                   INNER JOIN results r ON r.id = l.results_id \
                                                   WHERE r.public_id=$1 AND l.id=$2;",
  localityElectionAdministrationOverseasVoterContact: "SELECT eo.* \
                                                       FROM localities l \
                                                       INNER JOIN election_administrations ea ON ea.id = l.election_administration_id AND ea.results_id = l.results_id \
                                                       INNER JOIN election_officials eo ON eo.id = ea.ovc_id AND eo.results_id = l.results_id \
                                                       INNER JOIN results r ON r.id = l.results_id \
                                                       WHERE r.public_id=$1 AND l.id=$2;",
  localityPrecincts: "SELECT p.id, p.name, \
                             (SELECT COUNT(ps.*) \
                              FROM precinct_splits ps \
                              WHERE ps.precinct_id = p.id AND ps.results_id = l.results_id)::int AS precinct_splits \
                      FROM localities l \
                      INNER JOIN precincts p ON p.locality_id = l.id AND p.results_id = l.results_id \
                      INNER JOIN results r ON r.id = l.results_id \
                      WHERE r.public_id=$1 AND l.id=$2 \
                      GROUP BY p.id, p.name, l.results_id",
  localityOverviewEarlyVoteSites: "SELECT COUNT(evs.*)::int AS count \
                                   FROM localities l \
                                   INNER JOIN locality_early_vote_sites levs ON levs.locality_id = l.id AND levs.results_id = l.results_id \
                                   INNER JOIN early_vote_sites evs ON evs.id = levs.early_vote_site_id AND evs.results_id = l.results_id \
                                   INNER JOIN results r ON r.id = l.results_id \
                                   WHERE r.public_id=$1 AND l.id=$2;",
  localityOverviewEarlyVoteSitesErrors: "SELECT COUNT(v.*)::int AS count \
                                         FROM localities l \
                                         INNER JOIN locality_early_vote_sites levs ON levs.locality_id = l.id AND levs.results_id = l.results_id \
                                         INNER JOIN early_vote_sites evs ON evs.id = levs.early_vote_site_id AND evs.results_id = l.results_id \
                                         INNER JOIN validations v ON v.results_id = l.results_id AND v.scope = 'early-vote-sites' AND v.identifier = evs.id \
                                         INNER JOIN results r ON r.id = l.results_id \
                                         WHERE r.public_id=$1 AND l.id=$2;",
  localityOverviewElectionAdministrations: "SELECT COUNT(ea.*)::int AS count \
                                            FROM localities l \
                                            INNER JOIN election_administrations ea ON ea.id = l.election_administration_id AND ea.results_id = l.results_id \
                                            INNER JOIN results r ON r.id = l.results_id \
                                            WHERE r.public_id=$1 AND l.id=$2;",
  localityOverviewElectionAdministrationsErrors: "SELECT COUNT(v.*)::int AS count \
                                                  FROM localities l \
                                                  INNER JOIN election_administrations ea ON ea.id = l.election_administration_id AND ea.results_id = l.results_id \
                                                  INNER JOIN validations v ON v.results_id = l.results_id AND v.scope = 'election-administrations' AND v.identifier = ea.id \
                                                  INNER JOIN results r ON r.id = l.results_id \
                                                  WHERE r.public_id=$1 AND l.id=$2;",
  localityOverviewPollingLocations: "SELECT (ppl.count + pspl.count) AS count \
                                     FROM (SELECT COUNT(pl.*)::int AS count \
                                           FROM localities l \
                                           INNER JOIN precincts p ON p.locality_id = l.id AND p.results_id = l.results_id \
                                           INNER JOIN precinct_polling_locations ppl ON ppl.precinct_id = p.id AND ppl.results_id = l.results_id \
                                           INNER JOIN polling_locations pl ON pl.id = ppl.polling_location_id AND pl.results_id = l.results_id \
                                           INNER JOIN results r ON r.id = l.results_id \
                                           WHERE r.public_id=$1 AND l.id=$2) AS ppl, \
                                           (SELECT COUNT(pl.*)::int AS count \
                                           FROM localities l \
                                           INNER JOIN precincts p ON p.locality_id = l.id AND p.results_id = l.results_id \
                                           INNER JOIN precinct_splits ps ON ps.precinct_id = p.id AND ps.results_id = l.results_id \
                                           INNER JOIN precinct_split_polling_locations pspl ON pspl.precinct_split_id = p.id AND pspl.results_id = l.results_id \
                                           INNER JOIN polling_locations pl ON pl.id = pspl.polling_location_id AND pl.results_id = l.results_id \
                                           INNER JOIN results r ON r.id = l.results_id \
                                           WHERE r.public_id=$1 AND l.id=$2) AS pspl;",
  localityOverviewPollingLocationsErrors: "SELECT (ppl.count + pspl.count) AS count \
                                          FROM (SELECT COUNT(v.*)::int AS count \
                                                FROM localities l \
                                                INNER JOIN precincts p ON p.locality_id = l.id AND p.results_id = l.results_id \
                                                INNER JOIN precinct_polling_locations ppl ON ppl.precinct_id = p.id AND ppl.results_id = l.results_id \
                                                INNER JOIN polling_locations pl ON pl.id = ppl.polling_location_id AND pl.results_id = l.results_id \
                                                INNER JOIN validations v ON v.results_id = l.results_id AND v.scope = 'polling-locations' AND v.identifier = pl.id \
                                                INNER JOIN results r ON r.id = l.results_id \
                                                WHERE r.public_id=$1 AND l.id=$2) AS ppl, \
                                                (SELECT COUNT(v.*)::int AS count \
                                                FROM localities l \
                                                INNER JOIN precincts p ON p.locality_id = l.id AND p.results_id = l.results_id \
                                                INNER JOIN precinct_splits ps ON ps.precinct_id = p.id AND ps.results_id = l.results_id \
                                                INNER JOIN precinct_split_polling_locations pspl ON pspl.precinct_split_id = p.id AND pspl.results_id = l.results_id \
                                                INNER JOIN polling_locations pl ON pl.id = pspl.polling_location_id AND pl.results_id = l.results_id \
                                                INNER JOIN validations v ON v.results_id = l.results_id AND v.scope = 'polling-locations' AND v.identifier = pl.id \
                                                INNER JOIN results r ON r.id = l.results_id \
                                                WHERE r.public_id=$1 AND l.id=$2) AS pspl;",
  localityOverviewPrecincts: "SELECT COUNT(p.*)::int AS count \
                              FROM localities l \
                              INNER JOIN precincts p ON p.locality_id = l.id AND p.results_id = l.results_id \
                              INNER JOIN results r ON r.id = l.results_id \
                              WHERE r.public_id=$1 AND l.id=$2;",
  localityOverviewPrecinctsErrors: "SELECT COUNT(v.*)::int AS count \
                                    FROM localities l \
                                    INNER JOIN precincts p ON p.locality_id = l.id AND p.results_id = l.results_id \
                                    INNER JOIN validations v ON v.results_id = l.results_id AND v.scope = 'precincts' AND v.identifier = p.id \
                                    INNER JOIN results r ON r.id = l.results_id \
                                    WHERE r.public_id=$1 AND l.id=$2;",
  localityOverviewPrecinctSplits: "SELECT COUNT(ps.*)::int AS count \
                                   FROM localities l \
                                   INNER JOIN precincts p ON p.locality_id = l.id AND p.results_id = l.results_id \
                                   INNER JOIN precinct_splits ps ON ps.precinct_id = p.id AND ps.results_id = l.results_id \
                                   INNER JOIN results r ON r.id = l.results_id \
                                   WHERE r.public_id=$1 AND l.id=$2;",
  localityOverviewPrecinctSplitsErrors: "SELECT COUNT(v.*)::int AS count \
                                         FROM localities l \
                                         INNER JOIN precincts p ON p.locality_id = l.id AND p.results_id = l.results_id \
                                         INNER JOIN precinct_splits ps ON ps.precinct_id = p.id AND ps.results_id = l.results_id \
                                         INNER JOIN validations v ON v.results_id = l.results_id AND v.scope = 'precinct-splits' AND v.identifier = ps.id \
                                         INNER JOIN results r ON r.id = l.results_id \
                                         WHERE r.public_id=$1 AND l.id=$2;",
  localityOverviewStreetSegments: "SELECT COUNT(ss.*)::int AS count \
                                   FROM localities l \
                                   INNER JOIN precincts p ON p.locality_id = l.id AND p.results_id = l.results_id \
                                   INNER JOIN street_segments ss ON ss.precinct_id = p.id AND ss.results_id = l.results_id \
                                   INNER JOIN results r ON r.id = l.results_id \
                                   WHERE r.public_id=$1 AND l.id=$2;",
  localityOverviewStreetSegmentsErrors: "SELECT COUNT(v.*)::int AS count \
                                         FROM localities l \
                                         INNER JOIN precincts p ON p.locality_id = l.id AND p.results_id = l.results_id \
                                         INNER JOIN street_segments ss ON ss.precinct_id = p.id AND ss.results_id = l.results_id \
                                         INNER JOIN validations v ON v.results_id = l.results_id AND v.scope = 'street-segments' AND v.identifier = ss.id \
                                         INNER JOIN results r ON r.id = l.results_id \
                                         WHERE r.public_id=$1 AND l.id=$2;",
  pollingLocation: "SELECT pl.*, \
                           (SELECT COUNT(v.*) \
                            FROM validations v \
                            WHERE v.results_id = pl.results_id AND v.scope = 'polling-locations' AND v.identifier = pl.id) AS error_count \
                    FROM polling_locations pl \
                    INNER JOIN results r ON r.id = pl.results_id \
                    WHERE r.public_id=$1 AND pl.id=$2;",
  pollingLocationPrecincts: "SELECT p.*, \
                                    (SELECT COUNT(ed.*) \
                                     FROM electoral_districts ed \
                                     INNER JOIN precinct_electoral_districts ped ON ped.precinct_id = p.id AND ped.results_id = p.results_id \
                                     WHERE ed.id = ped.electoral_district_id AND ed.results_id = p.results_id) AS electoral_districts \
                             FROM polling_locations pl \
                             INNER JOIN precinct_polling_locations ppl ON ppl.polling_location_id = pl.id AND ppl.results_id = pl.results_id \
                             INNER JOIN precincts p ON p.id = ppl.precinct_id AND p.results_id = pl.results_id \
                             INNER JOIN results r ON r.id = pl.results_id \
                             WHERE r.public_id=$1 AND pl.id=$2;",
  pollingLocationPrecinctSplits: "SELECT ps.*, \
                                         (SELECT COUNT(ed.*) \
                                          FROM electoral_districts ed \
                                          INNER JOIN precinct_split_electoral_districts psed ON psed.precinct_split_id = ps.id AND psed.results_id = ps.results_id \
                                          WHERE ed.id = psed.electoral_district_id AND ed.results_id = ps.results_id) AS electoral_districts \
                                  FROM polling_locations pl \
                                  INNER JOIN precinct_split_polling_locations pspl ON pspl.polling_location_id = pl.id AND pspl.results_id = pl.results_id \
                                  INNER JOIN precinct_splits ps ON ps.id = pspl.precinct_split_id AND ps.results_id = pl.results_id \
                                  INNER JOIN precinct_split_electoral_districts psed ON psed.precinct_split_id = ps.id AND psed.results_id = ps.results_id \
                                  INNER JOIN electoral_districts ed ON ed.id = psed.electoral_district_id AND ed.results_id = ps.results_id \
                                  INNER JOIN results r ON r.id = pl.results_id \
                                  WHERE r.public_id=$1 AND pl.id=$2;",
  precinct: "SELECT p.*, \
             (SELECT COUNT(v.*) \
              FROM validations v \
              WHERE v.results_id = p.results_id AND v.scope = 'precincts' AND v.identifier = p.id) AS error_count \
             FROM precincts p \
             INNER JOIN results r ON r.id = p.results_id \
             WHERE r.public_id=$1 AND p.id=$2;",
  precinctEarlyVoteSites: "SELECT evs.* \
                           FROM precincts p \
                           INNER JOIN precinct_early_vote_sites pevs ON pevs.precinct_id = p.id AND pevs.results_id = p.results_id \
                           INNER JOIN early_vote_sites evs ON evs.id = pevs.early_vote_site_id AND evs.results_id = p.results_id \
                           INNER JOIN results r ON r.id = p.results_id \
                           WHERE r.public_id=$1 AND p.id=$2;",
  precinctElectoralDistricts: "SELECT ed.*, \
                                      (SELECT COUNT(c.*) \
                                       FROM contests c \
                                       WHERE c.electoral_district_id = ed.id AND c.results_id = p.results_id) AS contests \
                               FROM precincts p \
                               INNER JOIN precinct_electoral_districts ped ON ped.precinct_id = p.id AND ped.results_id = p.results_id \
                               INNER JOIN electoral_districts ed ON ed.id = ped.electoral_district_id AND ed.results_id = p.results_id \
                               INNER JOIN results r ON r.id = p.results_id \
                               WHERE r.public_id=$1 AND p.id=$2;",
  precinctPollingLocations: "SELECT pl.* \
                            FROM precincts p \
                            INNER JOIN precinct_polling_locations ppl ON ppl.precinct_id = p.id AND ppl.results_id = p.results_id \
                            INNER JOIN polling_locations pl ON pl.id = ppl.polling_location_id AND pl.results_id = p.results_id \
                            INNER JOIN results r ON r.id = p.results_id \
                            WHERE r.public_id=$1 AND p.id=$2;",
  precinctPrecinctSplits: "SELECT ps.*, \
                                  (SELECT COUNT(ss.*) \
                                   FROM street_segments ss \
                                   WHERE ss.precinct_split_id = ps.id AND ss.results_id = ps.results_id) AS street_segments \
                           FROM precincts p \
                           INNER JOIN precinct_splits ps ON ps.precinct_id = p.id AND ps.results_id = p.results_id \
                           INNER JOIN results r ON r.id = p.results_id \
                           WHERE r.public_id=$1 AND p.id=$2;",
  precinctStreetSegments: "SELECT COUNT(ss.*) AS total, \
                           COUNT(v.*) AS error_count \
                           FROM precincts p \
                           INNER JOIN street_segments ss ON ss.precinct_id = p.id AND ss.results_id = p.results_id \
                           INNER JOIN validations v ON v.results_id = p.results_id AND v.scope = 'street-segments' AND v.identifier = ss.id \
                           INNER JOIN results r ON r.id = p.results_id \
                           WHERE r.public_id=$1 AND p.id=$2;",
  precinctSplit: "SELECT ps.*, \
                  (SELECT COUNT(v.*) \
                   FROM validations v \
                   WHERE v.results_id = ps.results_id AND v.scope = 'precinct-splits' AND v.identifier = ps.id) AS error_count \
                  FROM precinct_splits ps \
                  INNER JOIN results r ON r.id = ps.results_id \
                  WHERE r.public_id = $1 AND ps.id = $2",
  precinctSplitElectoralDistricts: "SELECT ed.*, \
                                    (SELECT COUNT(c.*) \
                                     FROM contests c \
                                     WHERE c.electoral_district_id = ed.id AND c.results_id = ps.results_id) AS contests \
                                    FROM precinct_splits ps \
                                    INNER JOIN precinct_split_electoral_districts psed ON psed.precinct_split_id = ps.id AND psed.results_id = ps.results_id \
                                    INNER JOIN electoral_districts ed ON ed.id = psed.electoral_district_id AND ed.results_id = ps.results_id \
                                    INNER JOIN results r ON r.id = ps.results_id \
                                    WHERE r.public_id = $1 AND ps.id = $2",
  precinctSplitPollingLocations: "SELECT pl.* \
                                  FROM precinct_splits ps \
                                  INNER JOIN precinct_split_polling_locations pspl ON pspl.precinct_split_id = ps.id AND pspl.results_id = ps.results_id \
                                  INNER JOIN polling_locations pl ON pl.id = pspl.polling_location_id AND pl.results_id = ps.results_id \
                                  INNER JOIN results r ON r.id = ps.results_id \
                                  WHERE r.public_id = $1 AND ps.id = $2;",
  precinctSplitStreetSegments: "SELECT COUNT(ss.*) AS total, \
                                COUNT(v.*) AS error_count \
                                FROM precinct_splits ps \
                                INNER JOIN street_segments ss ON ss.precinct_split_id = ps.id AND ss.results_id = ps.results_id \
                                INNER JOIN validations v ON v.results_id = ps.results_id AND v.scope = 'street-segments' AND v.identifier = ss.id \
                                INNER JOIN results r ON r.id = ps.results_id \
                                WHERE r.public_id=$1 AND ps.id=$2;",
  earlyVoteSite: "SELECT evs.*, \
                         (SELECT COUNT(v.*) \
                          FROM validations v \
                          WHERE v.results_id = evs.results_id AND v.scope = 'early-vote-sites' AND v.identifier = evs.id) AS error_count \
                  FROM early_vote_sites evs \
                  INNER JOIN results r ON r.id = evs.results_id \
                  WHERE r.public_id = $1 AND evs.id = $2;",
  electoralDistrict: "SELECT ed.*, \
                             (SELECT COUNT(v.*) \
                              FROM validations v \
                              WHERE v.results_id = ed.results_id AND v.scope = 'electoral-districts' AND v.identifier = ed.id) AS error_count \
                      FROM electoral_districts ed \
                      INNER JOIN results r ON r.id = ed.results_id \
                      WHERE r.public_id=$1 AND ed.id=$2;",
  electoralDistrictContest: "SELECT c.* \
                             FROM electoral_districts ed \
                             INNER JOIN contests c ON c.results_id = ed.results_id AND c.electoral_district_id = ed.id \
                             INNER JOIN results r ON r.id = ed.results_id \
                             WHERE r.public_id=$1 AND ed.id=$2;",
  electoralDistrictPrecincts: "SELECT p.id, p.name, COUNT(psed.*) AS precinct_splits \
                               FROM electoral_districts ed \
                               INNER JOIN precinct_electoral_districts ped ON ped.results_id = ed.results_id AND ped.electoral_district_id = ed.id \
                               INNER JOIN precincts p ON p.results_id = ed.results_id AND p.id = ped.precinct_id \
                               INNER JOIN precinct_split_electoral_districts psed ON psed.results_id = ed.results_id AND psed.electoral_district_id = ed.id \
                               INNER JOIN results r ON r.id = ed.results_id \
                               WHERE r.public_id=$1 AND ed.id=$2 \
                               GROUP BY p.id, p.name;",
  electoralDistrictPrecinctSplits: "SELECT ps.id, ps.name, COUNT(ss.*) AS street_segments \
                                    FROM electoral_districts ed \
                                    INNER JOIN precinct_split_electoral_districts psed ON psed.results_id = ed.results_id AND psed.electoral_district_id = ed.id \
                                    INNER JOIN precinct_splits ps ON ps.results_id = ed.results_id AND ps.id = psed.precinct_split_id \
                                    INNER JOIN street_segments ss ON ss.results_id = ed.results_id AND ss.precinct_split_id = ps.id \
                                    INNER JOIN results r ON r.id = ed.results_id \
                                    WHERE r.public_id=$1 AND ed.id=$2 \
                                    GROUP BY ps.id, ps.name;",

  // errors
  overallErrorQuery: function(scope) { return buildErrorQuery("", "v.scope = '" + scope  +"'"); },
  candidateErrors: buildErrorQuery("INNER JOIN candidates c ON v.identifier = c.id AND c.results_id = v.results_id",
                                   "v.scope = 'candidates' AND c.id = $2"),
  contestBallotErrors: buildErrorQuery("INNER JOIN contests c ON v.identifier = c.ballot_id AND c.results_id = v.results_id",
                                       "v.scope = 'ballots' AND c.id = $2"),
  contestErrors: buildErrorQuery("INNER JOIN contests c ON v.identifier = c.id AND c.results_id = v.results_id",
                                 "v.scope = 'contests' AND c.id = $2"),
  localityEarlyVoteSitesErrors: buildErrorQuery("INNER JOIN localities l ON l.results_id = v.results_id \
                                                 INNER JOIN locality_early_vote_sites levs ON levs.locality_id = l.id AND levs.results_id = v.results_id \
                                                 INNER JOIN early_vote_sites evs ON evs.id = levs.early_vote_site_id AND evs.results_id = v.results_id",
                                                 "v.scope = 'early-vote-sites' AND l.id = $2"),
  localityElectionAdministrationsErrors: buildErrorQuery("INNER JOIN localities l ON l.results_id = v.results_id \
                                                          INNER JOIN election_administrations ea ON l.election_administration_id = ea.id AND ea.results_id = v.results_id",
                                                          "v.scope = 'election-administrations' AND l.id = $2"),
  localityPollingLocationsErrors: buildErrorQuery("LEFT JOIN (SELECT pl.id, pl.results_id, p.locality_id FROM polling_locations pl \
                                                              INNER JOIN precinct_polling_locations ppl ON ppl.polling_location_id = pl.id AND ppl.results_id = pl.results_id \
                                                              INNER JOIN precincts p ON p.id = ppl.precinct_id AND p.results_id = pl.results_id) AS ppl ON v.identifier = ppl.id AND ppl.results_id = v.results_id \
                                                   LEFT JOIN (SELECT pl.id, pl.results_id, p.locality_id FROM polling_locations pl \
                                                              INNER JOIN precinct_split_polling_locations pspl ON pspl.polling_location_id = pl.id AND pspl.results_id = pl.results_id \
                                                              INNER JOIN precinct_splits ps ON ps.id = pspl.precinct_split_id AND ps.results_id = pl.results_id \
                                                              INNER JOIN precincts p ON p.id = ps.precinct_id AND p.results_id = pl.results_id) AS pspl ON v.identifier = pspl.id AND pspl.results_id = v.results_id \
                                                   INNER JOIN localities l ON l.id = ppl.locality_id OR l.id = pspl.locality_id",
                                                   "v.scope = 'polling-locations' AND l.id=$2"),
  localityPrecinctSplitsErrors: buildErrorQuery("INNER JOIN localities l ON l.results_id = v.results_id \
                                                 INNER JOIN precincts p ON p.locality_id = l.id AND p.results_id = v.results_id \
                                                 INNER JOIN precinct_splits ps ON ps.precinct_id = p.id AND ps.results_id = v.results_id",
                                                 "v.scope = 'precinct-splits' AND l.id = $2"),
  localityPrecinctsErrors: buildErrorQuery("INNER JOIN localities l ON l.results_id = v.results_id \
                                            INNER JOIN precincts p ON p.locality_id = l.id AND p.results_id = v.results_id",
                                            "v.scope = 'precincts' AND l.id = $2"),
  localityStreetSegmentsErrors: buildErrorQuery("INNER JOIN localities l ON l.results_id = v.results_id \
                                                 INNER JOIN precincts p ON p.locality_id = l.id AND p.results_id = v.results_id \
                                                 INNER JOIN street_segments ss ON ss.precinct_id = p.id AND ss.id = v.identifier AND ss.results_id = v.results_id",
                                                 "v.scope = 'street-segments' AND l.id = $2"),
  errors: buildErrorQuery("", "")
}