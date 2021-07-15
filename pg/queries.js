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
  feeds: "SELECT DISTINCT ON (r.id) \
                 r.id, r.public_id, r.start_time, date(r.end_time) AS end_time, \
                 CASE WHEN r.end_time IS NOT NULL \
                      THEN r.end_time - r.start_time END AS duration, \
                 r.spec_version, r.complete, r.election_date, r.election_type, r.state, r.stop_requested \
          FROM results r \
          ORDER BY r.id DESC \
          LIMIT 20 OFFSET ($1 * 20);",
  feedsForFipsCodes: "SELECT r.public_id, r.start_time, date(r.end_time) AS end_time, \
                             CASE WHEN r.end_time IS NOT NULL \
                                  THEN r.end_time - r.start_time END AS duration, \
                             r.spec_version, r.complete, r.state, r.election_type, r.election_date \
                  FROM results r \
                  WHERE r.vip_id LIKE ANY ($1) \
                  ORDER BY r.start_time DESC \
                  LIMIT 20 OFFSET ($2 * 20);",
  results: "SELECT * FROM results WHERE public_id=$1",
  errorsTotal: "SELECT (SELECT COUNT(v.*) \
                        FROM validations v \
                        WHERE r.id = v.results_id AND (v.severity = 'fatal' \
                        OR v.severity = 'critical' \
                        OR v.severity = 'errors')) AS important_error_count, \
                       (SELECT COUNT(v.*) \
                        FROM validations v \
                        WHERE r.id = v.results_id AND v.severity = 'warnings') AS warning_error_count \
                FROM results r \
                WHERE r.public_id = $1;",
  approvableStatus: "SELECT EXISTS \
                        (SELECT 1 \
                         FROM validations v \
                         INNER JOIN results r ON r.id = v.results_id \
                         WHERE r.public_id = $1 AND (v.severity = 'critical' OR severity = 'fatal')) AS not_approvable, \
                        ea.approved_result_id \
                        FROM election_approvals ea \
                        LEFT JOIN results r \
                               ON r.election_id = ea.election_id \
                        WHERE r.public_id = $1;",
  approveFeed: "UPDATE election_approvals SET approved_result_id = (SELECT id FROM results WHERE public_id = $1) \
                WHERE election_id = (SELECT election_id FROM results WHERE public_id = $1) AND \
                NOT EXISTS (SELECT 1 \
                            FROM validations v \
                            INNER JOIN results r ON r.id = v.results_id \
                            WHERE r.public_id = $1 AND (v.severity = 'critical' OR severity = 'fatal')) \
                RETURNING approved_result_id;",
  stopFeed: "UPDATE results SET stop_requested = $2 WHERE id = $1 RETURNING stop_requested;",

  overallErrorQuery: function(scope) { return buildErrorQuery("", "v.scope = '" + scope  +"'"); },

  errors: buildErrorQuery("", ""),

  v3: {
    contest: "SELECT c.*, \
                     (SELECT COUNT(v.*) \
                      FROM validations v \
                      WHERE r.id = v.results_id AND v.scope = 'contests' AND v.identifier = $2) AS error_count \
              FROM v3_0_contests c \
              INNER JOIN results r ON r.id = c.results_id \
              WHERE r.public_id=$1 AND c.id=$2;",
    contestBallot: "SELECT c.ballot_id, \
                           (SELECT COUNT(b.referendum_id) \
                            FROM v3_0_ballots b \
                            WHERE b.id=c.ballot_id AND b.results_id = c.results_id) AS referendum_count, \
                           (SELECT COUNT(*) \
                            FROM v3_0_ballot_candidates bc \
                            WHERE bc.results_id=c.results_id AND ballot_id=c.ballot_id) AS candidate_count \
                    FROM v3_0_contests c \
                    INNER JOIN results r ON r.id=c.results_id \
                    WHERE r.public_id=$1 AND c.id=$2;",
    contestBallotCandidate: "SELECT can.*, (SELECT COUNT(v.*) \
                                            FROM validations v \
                                            WHERE v.scope='candidates' AND v.identifier = can.id AND v.results_id = can.results_id) \
                                            AS error_count \
                             FROM v3_0_contests con \
                             INNER JOIN v3_0_ballot_candidates bc ON bc.ballot_id = con.ballot_id AND bc.results_id = con.results_id \
                             INNER JOIN v3_0_candidates can ON can.id = bc.candidate_id AND bc.results_id = can.results_id \
                             INNER JOIN results r ON r.id=con.results_id \
                             WHERE r.public_id=$1 AND con.id=$2 AND can.id=$3;",
    contestBallotCandidates: "SELECT can.* \
                             FROM v3_0_contests con \
                             INNER JOIN v3_0_ballot_candidates bc ON bc.ballot_id = con.ballot_id AND bc.results_id = con.results_id \
                             INNER JOIN v3_0_candidates can ON can.id = bc.candidate_id AND bc.results_id = can.results_id \
                             INNER JOIN results r ON r.id=con.results_id \
                             WHERE r.public_id=$1 AND con.id=$2;",
    contestBallotCustomBallot: "SELECT cb.* \
                                FROM v3_0_contests c \
                                LEFT JOIN v3_0_ballots b ON b.custom_ballot_id = c.ballot_id AND b.results_id = c.results_id \
                                LEFT JOIN v3_0_custom_ballots cb ON cb.id = b.custom_ballot_id AND cb.results_id = c.results_id \
                                LEFT JOIN results r ON r.id=c.results_id \
                                WHERE r.public_id=$1 AND c.id=$2;",
    contestBallotCustomBallotResponses: "SELECT br.*, \
                                         (SELECT COUNT(v.*) \
                                          FROM validations v \
                                          WHERE v.results_id=c.results_id AND scope = 'ballot_responses' AND identifier = br.id) AS error_count \
                                         FROM v3_0_contests c \
                                         LEFT JOIN v3_0_ballots b ON b.custom_ballot_id = c.ballot_id AND b.results_id = c.results_id \
                                         LEFT JOIN v3_0_custom_ballots cb ON cb.id = b.custom_ballot_id AND cb.results_id = c.results_id \
                                         LEFT JOIN v3_0_custom_ballot_ballot_responses cbbc ON cbbc.custom_ballot_id = cb.id AND cbbc.results_id = c.results_id \
                                         LEFT JOIN v3_0_ballot_responses br ON br.id = cbbc.ballot_response_id AND br.results_id = c.results_id \
                                         LEFT JOIN results r ON r.id=c.results_id \
                                         WHERE r.public_id=$1 AND c.id=$2;",
    contestBallotReferendum: "SELECT ref.* \
                              FROM v3_0_contests c \
                              LEFT JOIN v3_0_ballots b ON b.id = c.ballot_id AND b.results_id = c.results_id \
                              INNER JOIN v3_0_referendums ref ON ref.id = b.referendum_id AND ref.results_id = c.results_id \
                              LEFT JOIN results r ON r.id=c.results_id \
                              WHERE r.public_id=$1 AND c.id=$2;",
    contestElectoralDistrict: "SELECT ed.*, \
                                      (SELECT COUNT(v.*) \
                                       FROM validations v \
                                       WHERE v.results_id = c.results_id AND scope = 'electoral-districts' AND identifier = ed.id) AS error_count, \
                                      (SELECT COUNT(ped.*) \
                                       FROM v3_0_precinct_electoral_districts ped \
                                       WHERE ped.results_id = c.results_id AND ped.electoral_district_id = ed.id) AS precinct_count, \
                                      (SELECT COUNT(psed.*) \
                                       FROM v3_0_precinct_split_electoral_districts psed \
                                       WHERE psed.results_id = c.results_id AND psed.electoral_district_id = ed.id) AS precinct_split_count \
                        FROM v3_0_contests c \
                        INNER JOIN v3_0_electoral_districts ed ON ed.id = c.electoral_district_id \
                        INNER JOIN results r ON r.id = c.results_id \
                        WHERE r.public_id = $1 AND c.id = $2;",
    contestElectoralDistrictPrecinctSplits: "SELECT ps.id, ps.name, p.id AS precinct_id, p.locality_id AS locality_id, \
                                                    (SELECT COUNT(ss.*) \
                                                     FROM v3_0_street_segments ss \
                                                     WHERE ss.precinct_split_id = ps.id AND ss.results_id = c.results_id) AS street_segments \
                                             FROM v3_0_contests c \
                                             INNER JOIN v3_0_electoral_districts ed ON c.electoral_district_id = ed.id AND ed.results_id = c.results_id \
                                             INNER JOIN v3_0_precinct_split_electoral_districts psed ON psed.electoral_district_id = ed.id AND psed.results_id = c.results_id \
                                             INNER JOIN v3_0_precinct_splits ps ON ps.id = psed.precinct_split_id AND ps.results_id = c.results_id \
                                             INNER JOIN v3_0_precincts p ON p.id = ps.precinct_id AND p.results_id = c.results_id \
                                             INNER JOIN results r ON r.id = c.results_id \
                                             WHERE r.public_id = $1 AND c.id = $2 \
                                             GROUP BY ps.id, ps.name, p.id, p.locality_id, c.results_id;",
    contestOverviewBallot: "SELECT (CASE COUNT(b.*) \
                                    WHEN 0 THEN 100 \
                                    ELSE (COUNT(b.*) - COUNT(v.*)) / COUNT(b.*)::float * 100 END) AS completion, \
                                    COUNT(b.*) AS count, \
                                    COUNT(v.*) AS error_count \
                            FROM v3_0_contests c \
                            INNER JOIN v3_0_ballots b ON b.id = c.ballot_id AND b.results_id = c.results_id \
                            INNER JOIN validations v ON v.results_id = c.results_id AND v.scope = 'ballots' AND v.identifier = b.id \
                            INNER JOIN results r ON r.id = c.results_id \
                            WHERE r.public_id=$1 AND c.id=$2;",
    contestElectoralDistrictPrecincts: "SELECT p.id, p.name, p.locality_id, COUNT(ps.*) AS precinct_splits \
                                        FROM v3_0_contests c \
                                        INNER JOIN v3_0_electoral_districts ed ON c.electoral_district_id = ed.id AND ed.results_id = c.results_id \
                                        INNER JOIN v3_0_precinct_electoral_districts ped ON ped.electoral_district_id = ed.id AND ped.results_id = c.results_id \
                                        INNER JOIN v3_0_precincts p ON p.id = ped.precinct_id AND p.results_id = c.results_id \
                                        INNER JOIN v3_0_precinct_split_electoral_districts psed ON psed.electoral_district_id = ed.id AND psed.results_id = c.results_id \
                                        INNER JOIN v3_0_precinct_splits ps ON ps.id = psed.precinct_split_id AND ps.results_id = c.results_id \
                                        INNER JOIN results r ON r.id = c.results_id \
                                        WHERE r.public_id = $1 AND c.id = $2 \
                                        GROUP BY p.id, p.name, p.locality_id;",
    contestOverviewCandidates: "SELECT (CASE COUNT(can.*) \
                                        WHEN 0 THEN 100 \
                                        ELSE (COUNT(can.*) - COUNT(v.*)) / COUNT(can.*)::float * 100 END) AS completion, \
                                        COUNT(can.*) AS count, \
                                        COUNT(v.*) AS error_count \
                                FROM v3_0_contests c \
                                INNER JOIN v3_0_ballots b ON b.id = c.ballot_id AND b.results_id = c.results_id \
                                INNER JOIN v3_0_ballot_candidates bc ON bc.ballot_id = b.id AND bc.results_id = c.results_id \
                                INNER JOIN v3_0_candidates can ON can.id = bc.candidate_id AND can.results_id = c.results_id \
                                INNER JOIN validations v ON v.results_id = c.results_id AND v.scope = 'candidates' AND v.identifier = can.id \
                                INNER JOIN results r ON r.id = c.results_id \
                                WHERE r.public_id=$1 AND c.id=$2;",
    contestOverviewElectoralDistrict: "SELECT (CASE COUNT(ed.*) \
                                               WHEN 0 THEN 100 \
                                               ELSE (COUNT(ed.*) - COUNT(v.*)) / COUNT(ed.*)::float * 100 END) AS completion, \
                                               COUNT(ed.*) AS count, \
                                               COUNT(v.*) AS error_count \
                                       FROM v3_0_contests c \
                                       INNER JOIN v3_0_electoral_districts ed ON ed.id = c.electoral_district_id AND ed.results_id = c.results_id \
                                       INNER JOIN validations v ON v.results_id = c.results_id AND v.scope = 'electoral-districts' AND v.identifier = ed.id \
                                       INNER JOIN results r ON r.id = c.results_id \
                                       WHERE r.public_id=$1 AND c.id=$2;",
    contestOverviewReferendum: "SELECT (CASE COUNT(b.*) \
                                        WHEN 0 THEN 100 \
                                        ELSE (COUNT(b.*) - COUNT(v.*)) / COUNT(b.*)::float * 100 END) AS completion, \
                                        COUNT(b.*) AS count, \
                                        COUNT(v.*) AS error_count \
                                FROM v3_0_contests c \
                                INNER JOIN v3_0_ballots b ON b.id = c.ballot_id AND b.results_id = c.results_id \
                                INNER JOIN v3_0_referendums ref ON ref.id = b.referendum_id AND ref.results_id = c.results_id \
                                INNER JOIN validations v ON v.results_id = c.results_id AND v.scope = 'referendums' AND v.identifier = b.id \
                                INNER JOIN results r ON r.id = c.results_id \
                                WHERE r.public_id=$1 AND c.id=$2;",
    contests: "SELECT c.* \
               FROM v3_0_contests c \
               INNER JOIN results r ON r.id = c.results_id \
               WHERE r.public_id=$1",
    earlyVoteSite: "SELECT evs.*, \
                           (SELECT COUNT(v.*) \
                            FROM validations v \
                            WHERE v.results_id = evs.results_id AND v.scope = 'early-vote-sites' AND v.identifier = evs.id) AS error_count \
                    FROM v3_0_early_vote_sites evs \
                    INNER JOIN results r ON r.id = evs.results_id \
                    WHERE r.public_id = $1 AND evs.id = $2;",
    earlyVoteSites: "SELECT evs.* \
                    FROM v3_0_early_vote_sites evs \
                    INNER JOIN results r ON r.id = evs.results_id \
                    WHERE r.public_id = $1",
    election: "SELECT e.*, \
                      (SELECT COUNT(v.*) \
                       FROM validations v \
                       WHERE v.results_id = e.results_id AND scope='elections') AS error_count \
               FROM v3_0_elections e \
               INNER JOIN results r ON r.id = e.results_id \
               WHERE r.public_id=$1",
    electionAdministrations: "SELECT e.*, l.id AS locality_id, \
                                     CONCAT(e.physical_address_city, ', ', \
                                            e.physical_address_state, ', ', \
                                            e.physical_address_zip) AS address \
                              FROM v3_0_election_administrations e \
                              INNER JOIN v3_0_localities l ON l.election_administration_id = e.id AND l.results_id = e.results_id \
                              INNER JOIN results r ON e.results_id = r.id \
                              WHERE r.public_id=$1;",
    electoralDistrict: "SELECT ed.*, \
                               (SELECT COUNT(v.*) \
                                FROM validations v \
                                WHERE v.results_id = ed.results_id AND v.scope = 'electoral-districts' AND v.identifier = ed.id) AS error_count \
                        FROM v3_0_electoral_districts ed \
                        INNER JOIN results r ON r.id = ed.results_id \
                        WHERE r.public_id=$1 AND ed.id=$2;",
    electoralDistrictContest: "SELECT c.* \
                               FROM v3_0_electoral_districts ed \
                               INNER JOIN v3_0_contests c ON c.results_id = ed.results_id AND c.electoral_district_id = ed.id \
                               INNER JOIN results r ON r.id = ed.results_id \
                               WHERE r.public_id=$1 AND ed.id=$2;",
    electoralDistrictPrecinctSplits: "SELECT ps.id, ps.name, (SELECT COUNT(ss.*) \
                                                              FROM v3_0_street_segments ss \
                                                              WHERE ss.results_id = ed.results_id AND ss.precinct_split_id = ps.id) as street_segments \
                                      FROM v3_0_electoral_districts ed \
                                      INNER JOIN v3_0_precinct_split_electoral_districts psed ON psed.results_id = ed.results_id AND psed.electoral_district_id = ed.id \
                                      INNER JOIN v3_0_precinct_splits ps ON ps.results_id = ed.results_id AND ps.id = psed.precinct_split_id \
                                      INNER JOIN results r ON r.id = ed.results_id \
                                      WHERE r.public_id=$1 AND ed.id=$2 \
                                      GROUP BY ps.id, ps.name, ed.results_id;",
    electoralDistrictPrecincts: "SELECT p.id, p.name, COUNT(psed.*) AS precinct_splits \
                                 FROM v3_0_electoral_districts ed \
                                 INNER JOIN v3_0_precinct_electoral_districts ped ON ped.results_id = ed.results_id AND ped.electoral_district_id = ed.id \
                                 INNER JOIN v3_0_precincts p ON p.results_id = ed.results_id AND p.id = ped.precinct_id \
                                 INNER JOIN v3_0_precinct_split_electoral_districts psed ON psed.results_id = ed.results_id AND psed.electoral_district_id = ed.id \
                                 INNER JOIN results r ON r.id = ed.results_id \
                                 WHERE r.public_id=$1 AND ed.id=$2 \
                                 GROUP BY p.id, p.name;",
    localities: "with \
                  precincts as \
                    (select results_id, v3_0_precincts.id, locality_id \
                     from v3_0_precincts \
                     left join results r \
                      on v3_0_precincts.results_id = r.id \
                     where r.public_id = $1), \
                  precinct_splits as \
                    (select \
                       pl.id, \
                       ps.precinct_id \
                     from precincts p \
                     left join v3_0_precinct_splits ps \
                            on ps.precinct_id = p.id \
                           and ps.results_id = p.results_id \
                     left join v3_0_precinct_split_polling_locations pspl \
                             on pspl.precinct_split_id = ps.id \
                            and pspl.results_id = p.results_id \
                     left join v3_0_polling_locations pl \
                             on pl.id = pspl.polling_location_id \
                            and pl.results_id = p.results_id), \
                  polling_locations as \
                    (select \
                       pl.id, \
                       ppl.precinct_id \
                     from precincts p \
                     left join v3_0_precinct_polling_locations ppl on ppl.precinct_id = p.id and ppl.results_id = p.results_id \
                     left join v3_0_polling_locations pl on pl.id = ppl.polling_location_id and pl.results_id = p.results_id) \
                select \
                  p.locality_id as id, \
                  l.name,  \
                  count(distinct p.id) as precincts, \
                  count(distinct pl.id) as polling_locations, \
                  count(distinct pspl.id) as split_polling_locations \
                from results r \
                left join v3_0_localities l on l.results_id = r.id \
                left join precincts p on p.locality_id = l.id and p.results_id = r.id \
                left join polling_locations pl on pl.precinct_id = p.id \
                left join precinct_splits pspl on pspl.precinct_id = p.id \
                where r.public_id = $1 \
                group by p.locality_id, l.name;",
    locality: "SELECT l.*, (SELECT COUNT(v.*) \
                            FROM validations v \
                            WHERE v.results_id = l.results_id AND v.scope = 'precincts' AND v.identifier = l.id) AS error_count \
               FROM v3_0_localities l \
               LEFT JOIN results r ON r.id=l.results_id \
               WHERE r.public_id=$1 AND l.id=$2;",
    localityEarlyVoteSites: "SELECT evs.* \
                             FROM v3_0_localities l \
                             INNER JOIN v3_0_locality_early_vote_sites levs ON levs.locality_id = l.id AND levs.results_id = l.results_id \
                             INNER JOIN v3_0_early_vote_sites evs ON evs.id = levs.early_vote_site_id AND evs.results_id = l.results_id \
                             INNER JOIN results r ON r.id = l.results_id \
                             WHERE r.public_id=$1 AND l.id=$2;",
    localityElectionAdministration: "SELECT ea.*, (SELECT COUNT(v.*) \
                                                   FROM validations v \
                                                   WHERE v.results_id = l.results_id AND v.scope = 'election-administrations' AND v.identifier = ea.id) AS error_count \
                                     FROM v3_0_localities l \
                                     INNER JOIN v3_0_election_administrations ea ON ea.id = l.election_administration_id AND ea.results_id = l.results_id \
                                     INNER JOIN results r ON r.id = l.results_id \
                                     WHERE r.public_id=$1 AND l.id=$2;",
    localityElectionAdministrationElectionOfficial: "SELECT eo.* \
                                                     FROM v3_0_localities l \
                                                     INNER JOIN v3_0_election_administrations ea ON ea.id = l.election_administration_id AND ea.results_id = l.results_id \
                                                     INNER JOIN v3_0_election_officials eo ON eo.id = ea.eo_id AND eo.results_id = l.results_id \
                                                     INNER JOIN results r ON r.id = l.results_id \
                                                     WHERE r.public_id=$1 AND l.id=$2;",
    localityElectionAdministrationOverseasVoterContact: "SELECT eo.* \
                                                         FROM v3_0_localities l \
                                                         INNER JOIN v3_0_election_administrations ea ON ea.id = l.election_administration_id AND ea.results_id = l.results_id \
                                                         INNER JOIN v3_0_election_officials eo ON eo.id = ea.ovc_id AND eo.results_id = l.results_id \
                                                         INNER JOIN results r ON r.id = l.results_id \
                                                         WHERE r.public_id=$1 AND l.id=$2;",
    localityOverviewEarlyVoteSites: "SELECT COUNT(evs.*)::int AS count \
                                     FROM v3_0_localities l \
                                     INNER JOIN v3_0_locality_early_vote_sites levs ON levs.locality_id = l.id AND levs.results_id = l.results_id \
                                     INNER JOIN v3_0_early_vote_sites evs ON evs.id = levs.early_vote_site_id AND evs.results_id = l.results_id \
                                     INNER JOIN results r ON r.id = l.results_id \
                                     WHERE r.public_id=$1 AND l.id=$2;",
    localityOverviewEarlyVoteSitesErrors: "SELECT COUNT(v.*)::int AS count \
                                           FROM v3_0_localities l \
                                           INNER JOIN v3_0_locality_early_vote_sites levs ON levs.locality_id = l.id AND levs.results_id = l.results_id \
                                           INNER JOIN v3_0_early_vote_sites evs ON evs.id = levs.early_vote_site_id AND evs.results_id = l.results_id \
                                           INNER JOIN validations v ON v.results_id = l.results_id AND v.scope = 'early-vote-sites' AND v.identifier = evs.id \
                                           INNER JOIN results r ON r.id = l.results_id \
                                           WHERE r.public_id=$1 AND l.id=$2;",
    localityOverviewElectionAdministrations: "SELECT COUNT(ea.*)::int AS count \
                                              FROM v3_0_localities l \
                                              INNER JOIN v3_0_election_administrations ea ON ea.id = l.election_administration_id AND ea.results_id = l.results_id \
                                              INNER JOIN results r ON r.id = l.results_id \
                                              WHERE r.public_id=$1 AND l.id=$2;",
    localityOverviewElectionAdministrationsErrors: "SELECT COUNT(v.*)::int AS count \
                                                    FROM v3_0_localities l \
                                                    INNER JOIN v3_0_election_administrations ea ON ea.id = l.election_administration_id AND ea.results_id = l.results_id \
                                                    INNER JOIN validations v ON v.results_id = l.results_id AND v.scope = 'election-administrations' AND v.identifier = ea.id \
                                                    INNER JOIN results r ON r.id = l.results_id \
                                                    WHERE r.public_id=$1 AND l.id=$2;",

    localityOverviewPollingLocations: "SELECT (ppl.count + pspl.count) AS count \
                                       FROM (SELECT COUNT(DISTINCT pl.*)::int AS count \
                                             FROM v3_0_localities l \
                                             INNER JOIN v3_0_precincts p ON p.locality_id = l.id AND p.results_id = l.results_id \
                                             INNER JOIN v3_0_precinct_polling_locations ppl ON ppl.precinct_id = p.id AND ppl.results_id = l.results_id \
                                             INNER JOIN v3_0_polling_locations pl ON pl.id = ppl.polling_location_id AND pl.results_id = l.results_id \
                                             INNER JOIN results r ON r.id = l.results_id \
                                             WHERE r.public_id=$1 AND l.id=$2) AS ppl, \
                                             (SELECT COUNT(DISTINCT pl.*)::int AS count \
                                             FROM v3_0_localities l \
                                             INNER JOIN v3_0_precincts p ON p.locality_id = l.id AND p.results_id = l.results_id \
                                             INNER JOIN v3_0_precinct_splits ps ON ps.precinct_id = p.id AND ps.results_id = l.results_id \
                                             INNER JOIN v3_0_precinct_split_polling_locations pspl ON pspl.precinct_split_id = ps.id AND pspl.results_id = l.results_id \
                                             INNER JOIN v3_0_polling_locations pl ON pl.id = pspl.polling_location_id AND pl.results_id = l.results_id \
                                             INNER JOIN results r ON r.id = l.results_id \
                                             WHERE r.public_id=$1 AND l.id=$2) AS pspl;",
    localityOverviewPollingLocationsErrors: "SELECT (ppl.count + pspl.count) AS count \
                                            FROM (SELECT COUNT(v.*)::int AS count \
                                                  FROM v3_0_localities l \
                                                  INNER JOIN v3_0_precincts p ON p.locality_id = l.id AND p.results_id = l.results_id \
                                                  INNER JOIN v3_0_precinct_polling_locations ppl ON ppl.precinct_id = p.id AND ppl.results_id = l.results_id \
                                                  INNER JOIN v3_0_polling_locations pl ON pl.id = ppl.polling_location_id AND pl.results_id = l.results_id \
                                                  INNER JOIN validations v ON v.results_id = l.results_id AND v.scope = 'polling-locations' AND v.identifier = pl.id \
                                                  INNER JOIN results r ON r.id = l.results_id \
                                                  WHERE r.public_id=$1 AND l.id=$2) AS ppl, \
                                                  (SELECT COUNT(v.*)::int AS count \
                                                  FROM v3_0_localities l \
                                                  INNER JOIN v3_0_precincts p ON p.locality_id = l.id AND p.results_id = l.results_id \
                                                  INNER JOIN v3_0_precinct_splits ps ON ps.precinct_id = p.id AND ps.results_id = l.results_id \
                                                  INNER JOIN v3_0_precinct_split_polling_locations pspl ON pspl.precinct_split_id = ps.id AND pspl.results_id = l.results_id \
                                                  INNER JOIN v3_0_polling_locations pl ON pl.id = pspl.polling_location_id AND pl.results_id = l.results_id \
                                                  INNER JOIN validations v ON v.results_id = l.results_id AND v.scope = 'polling-locations' AND v.identifier = pl.id \
                                                  INNER JOIN results r ON r.id = l.results_id \
                                                  WHERE r.public_id=$1 AND l.id=$2) AS pspl;",
    localityOverviewPrecinctSplits: "SELECT COUNT(ps.*)::int AS count \
                                     FROM v3_0_localities l \
                                     INNER JOIN v3_0_precincts p ON p.locality_id = l.id AND p.results_id = l.results_id \
                                     INNER JOIN v3_0_precinct_splits ps ON ps.precinct_id = p.id AND ps.results_id = l.results_id \
                                     INNER JOIN results r ON r.id = l.results_id \
                                     WHERE r.public_id=$1 AND l.id=$2;",
    localityOverviewPrecinctSplitsErrors: "SELECT COUNT(v.*)::int AS count \
                                           FROM v3_0_localities l \
                                           INNER JOIN v3_0_precincts p ON p.locality_id = l.id AND p.results_id = l.results_id \
                                           INNER JOIN v3_0_precinct_splits ps ON ps.precinct_id = p.id AND ps.results_id = l.results_id \
                                           INNER JOIN validations v ON v.results_id = l.results_id AND v.scope = 'precinct-splits' AND v.identifier = ps.id \
                                           INNER JOIN results r ON r.id = l.results_id \
                                           WHERE r.public_id=$1 AND l.id=$2;",
    localityOverviewPrecincts: "SELECT COUNT(p.*)::int AS count \
                                FROM v3_0_localities l \
                                INNER JOIN v3_0_precincts p ON p.locality_id = l.id AND p.results_id = l.results_id \
                                INNER JOIN results r ON r.id = l.results_id \
                                WHERE r.public_id=$1 AND l.id=$2;",
    localityOverviewPrecinctsErrors: "SELECT COUNT(v.*)::int AS count \
                                      FROM v3_0_localities l \
                                      INNER JOIN v3_0_precincts p ON p.locality_id = l.id AND p.results_id = l.results_id \
                                      INNER JOIN validations v ON v.results_id = l.results_id AND v.scope = 'precincts' AND v.identifier = p.id \
                                      INNER JOIN results r ON r.id = l.results_id \
                                      WHERE r.public_id=$1 AND l.id=$2;",
    localityOverviewStreetSegments: "SELECT COUNT(ss.*)::int AS count \
                                     FROM v3_0_localities l \
                                     INNER JOIN v3_0_precincts p ON p.locality_id = l.id AND p.results_id = l.results_id \
                                     INNER JOIN v3_0_street_segments ss ON ss.precinct_id = p.id AND ss.results_id = l.results_id \
                                     INNER JOIN results r ON r.id = l.results_id \
                                     WHERE r.public_id=$1 AND l.id=$2;",
    localityOverviewStreetSegmentsErrors: "with street_segments as (select ss.id \
                                                                   from results r \
                                                                   left join v3_0_street_segments ss on ss.results_id = r.id \
                                                                   where r.public_id = $1 \
                                                                     and ss.precinct_id in (select ps.id \
                                                                                            from results r \
                                                                                            left join v3_0_precincts ps \
                                                                                                   on ps.results_id = r.id \
                                                                                                   and ps.locality_id = $2 \
                                                                                            where r.public_id = $1)) \
                                          select count(v.results_id)::int as count \
                                          from results r \
                                          left join validations v on v.results_id = r.id \
                                          left join street_segments ss on v.identifier = ss.id \
                                          where r.public_id = $1 \
                                            and v.scope = 'street-segments';",
    localityPrecincts: "SELECT p.id, p.name, \
                               (SELECT COUNT(ps.*) \
                                FROM v3_0_precinct_splits ps \
                                WHERE ps.precinct_id = p.id AND ps.results_id = l.results_id)::int AS precinct_splits \
                        FROM v3_0_localities l \
                        INNER JOIN v3_0_precincts p ON p.locality_id = l.id AND p.results_id = l.results_id \
                        INNER JOIN results r ON r.id = l.results_id \
                        WHERE r.public_id=$1 AND l.id=$2 \
                        GROUP BY p.id, p.name, l.results_id",
    pollingLocation: "SELECT pl.*, \
                             (SELECT COUNT(v.*) \
                              FROM validations v \
                              WHERE v.results_id = pl.results_id AND v.scope = 'polling-locations' AND v.identifier = pl.id) AS error_count \
                      FROM v3_0_polling_locations pl \
                      INNER JOIN results r ON r.id = pl.results_id \
                      WHERE r.public_id=$1 AND pl.id=$2;",
    pollingLocationPrecinctSplits: "SELECT ps.*, \
                                           (SELECT COUNT(ed.*) \
                                            FROM v3_0_electoral_districts ed \
                                            INNER JOIN v3_0_precinct_split_electoral_districts psed ON psed.precinct_split_id = ps.id AND psed.results_id = ps.results_id \
                                            WHERE ed.id = psed.electoral_district_id AND ed.results_id = ps.results_id) AS electoral_districts \
                                    FROM v3_0_polling_locations pl \
                                    INNER JOIN v3_0_precinct_split_polling_locations pspl ON pspl.polling_location_id = pl.id AND pspl.results_id = pl.results_id \
                                    INNER JOIN v3_0_precinct_splits ps ON ps.id = pspl.precinct_split_id AND ps.results_id = pl.results_id \
                                    INNER JOIN v3_0_precinct_split_electoral_districts psed ON psed.precinct_split_id = ps.id AND psed.results_id = ps.results_id \
                                    INNER JOIN v3_0_electoral_districts ed ON ed.id = psed.electoral_district_id AND ed.results_id = ps.results_id \
                                    INNER JOIN results r ON r.id = pl.results_id \
                                    WHERE r.public_id=$1 AND pl.id=$2;",
    pollingLocationPrecincts: "SELECT p.*, \
                                      (SELECT COUNT(ed.*) \
                                       FROM v3_0_electoral_districts ed \
                                       INNER JOIN v3_0_precinct_electoral_districts ped ON ped.precinct_id = p.id AND ped.results_id = p.results_id \
                                       WHERE ed.id = ped.electoral_district_id AND ed.results_id = p.results_id) AS electoral_districts \
                               FROM v3_0_polling_locations pl \
                               INNER JOIN v3_0_precinct_polling_locations ppl ON ppl.polling_location_id = pl.id AND ppl.results_id = pl.results_id \
                               INNER JOIN v3_0_precincts p ON p.id = ppl.precinct_id AND p.results_id = pl.results_id \
                               INNER JOIN results r ON r.id = pl.results_id \
                               WHERE r.public_id=$1 AND pl.id=$2;",
    precinct: "SELECT p.*, \
               (SELECT COUNT(v.*) \
                FROM validations v \
                WHERE v.results_id = p.results_id AND v.scope = 'precincts' AND v.identifier = p.id) AS error_count \
               FROM v3_0_precincts p \
               INNER JOIN results r ON r.id = p.results_id \
               WHERE r.public_id=$1 AND p.id=$2;",
    precinctEarlyVoteSites: "SELECT evs.* \
                             FROM v3_0_precincts p \
                             INNER JOIN v3_0_precinct_early_vote_sites pevs ON pevs.precinct_id = p.id AND pevs.results_id = p.results_id \
                             INNER JOIN v3_0_early_vote_sites evs ON evs.id = pevs.early_vote_site_id AND evs.results_id = p.results_id \
                             INNER JOIN results r ON r.id = p.results_id \
                             WHERE r.public_id=$1 AND p.id=$2;",
    precinctElectoralDistricts: "SELECT ed.*, \
                                        (SELECT COUNT(c.*) \
                                         FROM v3_0_contests c \
                                         WHERE c.electoral_district_id = ed.id AND c.results_id = p.results_id) AS contests \
                                 FROM v3_0_precincts p \
                                 INNER JOIN v3_0_precinct_electoral_districts ped ON ped.precinct_id = p.id AND ped.results_id = p.results_id \
                                 INNER JOIN v3_0_electoral_districts ed ON ed.id = ped.electoral_district_id AND ed.results_id = p.results_id \
                                 INNER JOIN results r ON r.id = p.results_id \
                                 WHERE r.public_id=$1 AND p.id=$2;",
    precinctPollingLocations: "SELECT pl.* \
                              FROM v3_0_precincts p \
                              INNER JOIN v3_0_precinct_polling_locations ppl ON ppl.precinct_id = p.id AND ppl.results_id = p.results_id \
                              INNER JOIN v3_0_polling_locations pl ON pl.id = ppl.polling_location_id AND pl.results_id = p.results_id \
                              INNER JOIN results r ON r.id = p.results_id \
                              WHERE r.public_id=$1 AND p.id=$2;",
    precinctPrecinctSplits: "SELECT ps.*, \
                                    (SELECT COUNT(ss.*) \
                                     FROM v3_0_street_segments ss \
                                     WHERE ss.precinct_split_id = ps.id AND ss.results_id = ps.results_id) AS street_segments \
                             FROM v3_0_precincts p \
                             INNER JOIN v3_0_precinct_splits ps ON ps.precinct_id = p.id AND ps.results_id = p.results_id \
                             INNER JOIN results r ON r.id = p.results_id \
                             WHERE r.public_id=$1 AND p.id=$2;",
    precinctSplit: "SELECT ps.*, \
                    (SELECT COUNT(v.*) \
                     FROM validations v \
                     WHERE v.results_id = ps.results_id AND v.scope = 'precinct-splits' AND v.identifier = ps.id) AS error_count \
                    FROM v3_0_precinct_splits ps \
                    INNER JOIN results r ON r.id = ps.results_id \
                    WHERE r.public_id = $1 AND ps.id = $2",
    precinctSplitElectoralDistricts: "SELECT ed.*, \
                                      (SELECT COUNT(c.*) \
                                       FROM v3_0_contests c \
                                       WHERE c.electoral_district_id = ed.id AND c.results_id = ps.results_id) AS contests \
                                      FROM v3_0_precinct_splits ps \
                                      INNER JOIN v3_0_precinct_split_electoral_districts psed ON psed.precinct_split_id = ps.id AND psed.results_id = ps.results_id \
                                      INNER JOIN v3_0_electoral_districts ed ON ed.id = psed.electoral_district_id AND ed.results_id = ps.results_id \
                                      INNER JOIN results r ON r.id = ps.results_id \
                                      WHERE r.public_id = $1 AND ps.id = $2",
    precinctSplitPollingLocations: "SELECT pl.* \
                                    FROM v3_0_precinct_splits ps \
                                    INNER JOIN v3_0_precinct_split_polling_locations pspl ON pspl.precinct_split_id = ps.id AND pspl.results_id = ps.results_id \
                                    INNER JOIN v3_0_polling_locations pl ON pl.id = pspl.polling_location_id AND pl.results_id = ps.results_id \
                                    INNER JOIN results r ON r.id = ps.results_id \
                                    WHERE r.public_id = $1 AND ps.id = $2;",
    precinctSplitStreetSegments: "SELECT COUNT(ss.*) AS total, \
                                  COUNT(v.*) AS error_count \
                                  FROM v3_0_precinct_splits ps \
                                  INNER JOIN v3_0_street_segments ss ON ss.precinct_split_id = ps.id AND ss.results_id = ps.results_id \
                                  INNER JOIN validations v ON v.results_id = ps.results_id AND v.scope = 'street-segments' AND v.identifier = ss.id \
                                  INNER JOIN results r ON r.id = ps.results_id \
                                  WHERE r.public_id=$1 AND ps.id=$2;",
    precinctStreetSegments: "SELECT COUNT(ss.*) AS total, \
                             COUNT(v.*) AS error_count \
                             FROM v3_0_precincts p \
                             INNER JOIN v3_0_street_segments ss ON ss.precinct_id = p.id AND ss.results_id = p.results_id \
                             INNER JOIN validations v ON v.results_id = p.results_id AND v.scope = 'street-segments' AND v.identifier = ss.id \
                             INNER JOIN results r ON r.id = p.results_id \
                             WHERE r.public_id=$1 AND p.id=$2;",
    referendum: "SELECT ref.*, \
                        (SELECT COUNT(v.*) \
                         FROM validations v \
                         WHERE v.results_id = ref.results_id AND scope='referendums' AND identifier = ref.id) AS error_count \
                 FROM v3_0_referendums ref \
                 INNER JOIN results r ON r.id = ref.results_id \
                 WHERE r.public_id=$1 AND ref.id = $2;",
    referendumBallotResponses: "SELECT br.*, \
                                       (SELECT COUNT(v.*) \
                                        FROM validations v \
                                        WHERE v.results_id = br.results_id AND scope='ballot_responses' AND identifier = br.id) AS error_count \
                                FROM v3_0_referendums ref \
                                INNER JOIN v3_0_referendum_ballot_responses rbr ON ref.id = rbr.referendum_id AND rbr.results_id = ref.results_id \
                                INNER JOIN v3_0_ballot_responses br ON br.id = rbr.ballot_response_id AND br.results_id = ref.results_id \
                                INNER JOIN results r ON r.id = ref.results_id \
                                WHERE r.public_id=$1 AND ref.id = $2;",
    source: "SELECT s.*, \
                    (SELECT COUNT(v.*) \
                     FROM validations v \
                     WHERE v.results_id = s.results_id AND scope='sources') AS error_count \
             FROM v3_0_sources s \
             INNER JOIN results r ON r.id = s.results_id \
             WHERE r.public_id=$1",
    state: "SELECT s.id, s.name, \
                   (SELECT COUNT(l.*)::int \
                    FROM v3_0_localities l \
                    WHERE l.results_id = s.results_id) AS locality_count, \
                   (SELECT COUNT(v.*)::int \
                    FROM validations v \
                    WHERE v.results_id = s.results_id AND v.scope = 'states') AS error_count \
            FROM v3_0_states s \
            INNER JOIN results r ON s.results_id = r.id \
            WHERE r.public_id = $1 GROUP BY s.id, s.name, s.results_id ORDER BY s.id;",
    stateElectionAdministration: "SELECT ea.*, \
                                         CONCAT(ea.physical_address_city, ', ', \
                                                ea.physical_address_state, ', ', \
                                                ea.physical_address_zip) AS address, \
                                         (SELECT l.id \
                                          FROM v3_0_localities l \
                                          WHERE l.election_administration_id = ea.id AND l.results_id = s.results_id) AS locality_id, \
                                         (SELECT COUNT(v.*) \
                                          FROM validations v \
                                          WHERE v.results_id = ea.results_id AND v.scope = 'election-administrations' AND v.identifier = ea.id) AS error_count \
                                  FROM v3_0_states s \
                                  INNER JOIN v3_0_election_administrations ea ON s.election_administration_id = ea.id AND ea.results_id = s.results_id \
                                  INNER JOIN results r ON s.results_id = r.id \
                                  WHERE r.public_id=$1;",

    // errors
    candidateErrors: buildErrorQuery("INNER JOIN v3_0_candidates c ON v.identifier = c.id AND c.results_id = v.results_id",
                                     "v.scope = 'candidates' AND c.id = $2"),
    contestBallotErrors: buildErrorQuery("INNER JOIN v3_0_contests c ON v.identifier = c.ballot_id AND c.results_id = v.results_id",
                                         "v.scope = 'ballots' AND c.id = $2"),
    contestCandidatesErrors: buildErrorQuery("INNER JOIN v3_0_contests c ON c.results_id = v.results_id \
                                              INNER JOIN v3_0_ballot_candidates bc ON c.ballot_id = bc.ballot_id AND v.identifier = bc.candidate_id AND bc.results_id = v.results_id",
                                              "v.scope = 'candidates' AND c.id = $2"),
    contestElectoralDistrictErrors: buildErrorQuery("INNER JOIN v3_0_contests c ON v.identifier = c.electoral_district_id AND c.results_id = v.results_id",
                                                    "v.scope = 'electoral-districts' AND c.id = $2"),
    contestReferendaErrors: buildErrorQuery("INNER JOIN v3_0_contests c ON c.results_id = v.results_id \
                                             INNER JOIN v3_0_ballots b ON b.id = c.ballot_id AND b.results_id = v.results_id \
                                             INNER JOIN v3_0_referendums ref ON b.referendum_id = ref.id AND v.identifier = ref.id AND ref.results_id = v.results_id",
                                            "v.scope = 'referendums' AND c.id = $2"),
    contestErrors: buildErrorQuery("INNER JOIN v3_0_contests c ON v.identifier = c.id AND c.results_id = v.results_id",
                                   "v.scope = 'contests' AND c.id = $2"),
    earlyVoteSiteErrors: buildErrorQuery("INNER JOIN v3_0_early_vote_sites evs ON v.identifier = evs.id AND evs.results_id = v.results_id",
                                         "v.scope = 'early-vote-sites' AND evs.id = $2"),
    localityEarlyVoteSitesErrors: buildErrorQuery("INNER JOIN v3_0_localities l ON l.results_id = v.results_id \
                                                   INNER JOIN v3_0_locality_early_vote_sites levs ON levs.locality_id = l.id AND levs.results_id = v.results_id \
                                                   INNER JOIN v3_0_early_vote_sites evs ON evs.id = levs.early_vote_site_id AND evs.results_id = v.results_id",
                                                   "v.scope = 'early-vote-sites' AND l.id = $2"),
    localityElectionAdministrationsErrors: buildErrorQuery("INNER JOIN v3_0_localities l ON l.results_id = v.results_id \
                                                            INNER JOIN v3_0_election_administrations ea ON l.election_administration_id = ea.id AND ea.results_id = v.results_id",
                                                            "v.scope = 'election-administrations' AND l.id = $2"),
    localityPollingLocationsErrors: buildErrorQuery("LEFT JOIN (SELECT pl.id, pl.results_id, p.locality_id FROM v3_0_polling_locations pl \
                                                                INNER JOIN v3_0_precinct_polling_locations ppl ON ppl.polling_location_id = pl.id AND ppl.results_id = pl.results_id \
                                                                INNER JOIN v3_0_precincts p ON p.id = ppl.precinct_id AND p.results_id = pl.results_id) AS ppl ON v.identifier = ppl.id AND ppl.results_id = v.results_id \
                                                     LEFT JOIN (SELECT pl.id, pl.results_id, p.locality_id FROM v3_0_polling_locations pl \
                                                                INNER JOIN v3_0_precinct_split_polling_locations pspl ON pspl.polling_location_id = pl.id AND pspl.results_id = pl.results_id \
                                                                INNER JOIN v3_0_precinct_splits ps ON ps.id = pspl.precinct_split_id AND ps.results_id = pl.results_id \
                                                                INNER JOIN v3_0_precincts p ON p.id = ps.precinct_id AND p.results_id = pl.results_id) AS pspl ON v.identifier = pspl.id AND pspl.results_id = v.results_id \
                                                     INNER JOIN v3_0_localities l ON l.id = ppl.locality_id OR l.id = pspl.locality_id",
                                                     "v.scope = 'polling-locations' AND l.id=$2"),
    localityPrecinctSplitsErrors: buildErrorQuery("INNER JOIN v3_0_localities l ON l.results_id = v.results_id \
                                                   INNER JOIN v3_0_precincts p ON p.locality_id = l.id AND p.results_id = v.results_id \
                                                   INNER JOIN v3_0_precinct_splits ps ON ps.precinct_id = p.id AND ps.results_id = v.results_id",
                                                   "v.scope = 'precinct-splits' AND l.id = $2"),
    localityPrecinctsErrors: buildErrorQuery("INNER JOIN v3_0_localities l ON l.results_id = v.results_id \
                                              INNER JOIN v3_0_precincts p ON p.locality_id = l.id AND p.results_id = v.results_id",
                                              "v.scope = 'precincts' AND l.id = $2"),
    precinctStreetSegmentsErrors: buildErrorQuery("INNER JOIN v3_0_precincts p ON p.results_id = v.results_id \
                                                   INNER JOIN v3_0_street_segments ss ON ss.results_id = v.results_id AND ss.precinct_id = p.id",
                                                  "v.scope = 'street-segments' AND p.id = $2"),
    localityStreetSegmentsErrors: buildErrorQuery("INNER JOIN v3_0_localities l ON l.results_id = v.results_id \
                                                   INNER JOIN v3_0_precincts p ON p.locality_id = l.id AND p.results_id = v.results_id \
                                                   INNER JOIN v3_0_street_segments ss ON ss.precinct_id = p.id AND ss.id = v.identifier AND ss.results_id = v.results_id",
                                                   "v.scope = 'street-segments' AND l.id = $2"),
    precinctSplitsErrors: buildErrorQuery("INNER JOIN v3_0_precinct_splits ps ON ps.results_id = v.results_id",
                                          "v.scope = 'precinct-splits' AND ps.id = $2"),
    electoralDistrictsErrors: buildErrorQuery("INNER JOIN v3_0_electoral_districts ed ON ed.results_id = v.results_id",
                                              "v.scope = 'electoral-districts' AND ed.id = $2"),
  }
}
