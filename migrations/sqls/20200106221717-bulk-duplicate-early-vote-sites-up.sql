CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE FUNCTION bulk_duplicate_early_vote_sites(old_election_id uuid, new_election_id uuid)
  RETURNS table(id uuid, election_id uuid, county_fips character,
	  			 type early_vote_site_type, name character,
				 address_1 character, address_2 character, address_3 character,
	  			 city character, state character, zip character,
				 directions character, voter_services character) as $$
BEGIN
  INSERT INTO early_vote_sites(id, election_id, county_fips,
	  							type, name,
							    address_1, address_2, address_3,
							   	city, state, zip,
							    directions, voter_services)
	SELECT uuid_generate_v4(), new_election_id, evs.county_fips,
		   evs.type, evs.name,
		   evs.address_1, evs.address_2, evs.address_3,
		   evs.city, evs.state, evs.zip,
		   evs.directions, evs.voter_services
	FROM early_vote_sites AS evs
	WHERE evs.election_id = old_election_id;
END; $$
LANGUAGE PLPGSQL;

CREATE FUNCTION clone_election(old_election_id uuid)
  RETURNS table(id uuid, election_id uuid, county_fips character,
	  			 type early_vote_site_type, name character,
				 address_1 character, address_2 character, address_3 character,
	  			 city character, state character, zip character,
				 directions character, voter_services character) as $$
BEGIN
  WITH new_election AS (INSERT INTO elections(id, state_fips, election_date)
		SELECT uuid_generate_v4(), e.state_fips, e.election_date
		FROM elections AS e
		WHERE e.id = old_election_id
		RETURNING *)
  INSERT INTO early_vote_sites(id, election_id, county_fips,
	  							type, name,
							    address_1, address_2, address_3,
							   	city, state, zip,
							    directions, voter_services)
	SELECT uuid_generate_v4(), (SELECT new_election.id from new_election), evs.county_fips,
		   evs.type, evs.name,
		   evs.address_1, evs.address_2, evs.address_3,
		   evs.city, evs.state, evs.zip,
		   evs.directions, evs.voter_services
	FROM early_vote_sites AS evs
	WHERE evs.election_id = old_election_id;
END; $$
LANGUAGE PLPGSQL;
