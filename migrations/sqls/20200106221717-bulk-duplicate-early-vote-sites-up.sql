-- CREATE EXTENSION IF NOT EXISTS uuid-ossp;
--
-- CREATE FUNCTION bulk_duplicate_elections(old_election_id uuidv4, new_election_id uuidv4)
-- BEGIN
-- END

CREATE FUNCTION inc(val integer) RETURNS integer AS $$
BEGIN
RETURN val + 1;
END; $$
LANGUAGE PLPGSQL;
