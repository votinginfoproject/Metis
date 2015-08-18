--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

CREATE TABLE ballot_candidates (
    results_id bigint NOT NULL,
    ballot_id bigint,
    candidate_id bigint
);


ALTER TABLE ballot_candidates;

CREATE TABLE ballot_line_results (
    id bigint NOT NULL,
    results_id bigint NOT NULL,
    contest_id bigint,
    jurisdiction_id bigint,
    entire_district boolean,
    candidate_id bigint,
    ballot_response_id bigint,
    votes integer,
    overvotes integer,
    victorious boolean,
    certification text
);


ALTER TABLE ballot_line_results;

CREATE TABLE ballot_responses (
    id bigint NOT NULL,
    results_id bigint NOT NULL,
    text text,
    sort_order integer
);


ALTER TABLE ballot_responses;

CREATE TABLE ballots (
    id bigint NOT NULL,
    results_id bigint NOT NULL,
    referendum_id bigint,
    custom_ballot_id bigint,
    write_in boolean,
    image_url text
);


ALTER TABLE ballots;

CREATE TABLE candidates (
    id bigint NOT NULL,
    results_id bigint NOT NULL,
    name text,
    party text,
    candidate_url text,
    biography text,
    phone text,
    photo_url text,
    filed_mailing_address_location_name text,
    filed_mailing_address_line1 text,
    filed_mailing_address_line2 text,
    filed_mailing_address_line3 text,
    filed_mailing_address_city text,
    filed_mailing_address_state text,
    filed_mailing_address_zip text,
    email text,
    sort_order integer
);


ALTER TABLE candidates;

CREATE TABLE contest_results (
    id bigint NOT NULL,
    results_id bigint NOT NULL,
    contest_id bigint,
    jurisdiction_id bigint,
    entire_district boolean,
    total_votes integer,
    total_valid_votes integer,
    overvotes integer,
    blank_votes integer,
    accepted_provisional_votes integer,
    rejected_votes integer,
    certification text
);


ALTER TABLE contest_results;

CREATE TABLE contests (
    id bigint NOT NULL,
    results_id bigint NOT NULL,
    election_id bigint,
    electoral_district_id bigint,
    type text,
    partisan boolean,
    primary_party text,
    electorate_specifications text,
    special boolean,
    office text,
    filing_closed_date date,
    number_elected integer,
    number_voting_for integer,
    ballot_id bigint,
    ballot_placement integer
);


ALTER TABLE contests;

CREATE TABLE custom_ballot_ballot_responses (
    results_id bigint NOT NULL,
    custom_ballot_id bigint,
    ballot_response_id bigint,
    sort_order integer
);


ALTER TABLE custom_ballot_ballot_responses;

CREATE TABLE custom_ballots (
    id bigint NOT NULL,
    results_id bigint NOT NULL,
    heading text
);


ALTER TABLE custom_ballots;

CREATE TABLE early_vote_sites (
    id bigint NOT NULL,
    results_id bigint NOT NULL,
    name text,
    address_location_name text,
    address_line1 text,
    address_line2 text,
    address_line3 text,
    address_city text,
    address_state text,
    address_zip text,
    directions text,
    voter_services text,
    start_date text,
    end_date text,
    days_times_open text
);


ALTER TABLE early_vote_sites;

CREATE TABLE election_administrations (
    id bigint NOT NULL,
    results_id bigint NOT NULL,
    name text,
    eo_id bigint,
    ovc_id bigint,
    physical_address_location_name text,
    physical_address_line1 text,
    physical_address_line2 text,
    physical_address_line3 text,
    physical_address_city text,
    physical_address_state text,
    physical_address_zip text,
    mailing_address_location_name text,
    mailing_address_line1 text,
    mailing_address_line2 text,
    mailing_address_line3 text,
    mailing_address_city text,
    mailing_address_state text,
    mailing_address_zip text,
    elections_url text,
    registration_url text,
    am_i_registered_url text,
    absentee_url text,
    where_do_i_vote_url text,
    what_is_on_my_ballot_url text,
    rules_url text,
    voter_services text,
    hours text
);


ALTER TABLE election_administrations;

CREATE TABLE election_officials (
    id bigint NOT NULL,
    results_id bigint NOT NULL,
    name text,
    title text,
    phone text,
    fax text,
    email text
);


ALTER TABLE election_officials;

CREATE TABLE elections (
    id bigint NOT NULL,
    results_id bigint NOT NULL,
    absentee_ballot_info text,
    absentee_request_deadline date,
    date date,
    election_day_registration boolean,
    election_type character varying(20),
    polling_hours text,
    registration_deadline date,
    registration_info text,
    results_url text,
    state_id bigint,
    statewide boolean
);


ALTER TABLE elections;

CREATE TABLE electoral_districts (
    id bigint NOT NULL,
    results_id bigint NOT NULL,
    name text,
    type text,
    number text
);


ALTER TABLE electoral_districts;

CREATE TABLE localities (
    id bigint NOT NULL,
    results_id bigint NOT NULL,
    name text,
    state_id bigint,
    type text,
    election_administration_id bigint
);


ALTER TABLE localities;

CREATE TABLE locality_early_vote_sites (
    results_id bigint NOT NULL,
    locality_id bigint,
    early_vote_site_id bigint
);


ALTER TABLE locality_early_vote_sites;

CREATE TABLE polling_locations (
    id bigint NOT NULL,
    results_id bigint NOT NULL,
    address_location_name text,
    address_line1 text,
    address_line2 text,
    address_line3 text,
    address_city text,
    address_state text,
    address_zip text,
    directions text,
    polling_hours text,
    photo_url text
);


ALTER TABLE polling_locations;

CREATE TABLE precinct_early_vote_sites (
    results_id bigint NOT NULL,
    precinct_id bigint,
    early_vote_site_id bigint
);


ALTER TABLE precinct_early_vote_sites;

CREATE TABLE precinct_electoral_districts (
    results_id bigint NOT NULL,
    precinct_id bigint,
    electoral_district_id bigint
);


ALTER TABLE precinct_electoral_districts;

CREATE TABLE precinct_polling_locations (
    results_id bigint NOT NULL,
    precinct_id bigint,
    polling_location_id bigint
);


ALTER TABLE precinct_polling_locations;

CREATE TABLE precinct_split_electoral_districts (
    results_id bigint NOT NULL,
    precinct_split_id bigint,
    electoral_district_id bigint
);


ALTER TABLE precinct_split_electoral_districts;

CREATE TABLE precinct_split_polling_locations (
    results_id bigint NOT NULL,
    precinct_split_id bigint,
    polling_location_id bigint
);


ALTER TABLE precinct_split_polling_locations;

CREATE TABLE precinct_splits (
    id bigint NOT NULL,
    results_id bigint NOT NULL,
    name text,
    precinct_id bigint,
    ballot_style_image_url text
);


ALTER TABLE precinct_splits;

CREATE TABLE precincts (
    id bigint NOT NULL,
    results_id bigint NOT NULL,
    name text,
    number text,
    locality_id bigint,
    ward text,
    mail_only boolean,
    ballot_style_image_url text
);


ALTER TABLE precincts;

CREATE TABLE ragtime_migrations (
    id character varying(255),
    created_at character varying(32)
);


ALTER TABLE ragtime_migrations;

CREATE TABLE referendum_ballot_responses (
    results_id bigint NOT NULL,
    referendum_id bigint,
    ballot_response_id bigint,
    sort_order integer
);


ALTER TABLE referendum_ballot_responses;

CREATE TABLE referendums (
    id bigint NOT NULL,
    results_id bigint NOT NULL,
    title text,
    subtitle text,
    brief text,
    text text,
    pro_statement text,
    con_statement text,
    passage_threshold text,
    effect_of_abstain text
);


ALTER TABLE referendums;

CREATE TABLE results (
    id integer NOT NULL,
    public_id character varying(255),
    start_time timestamp with time zone,
    filename character varying(255),
    complete boolean,
    end_time timestamp with time zone,
    exception text
);


ALTER TABLE results;

CREATE SEQUENCE results_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE results_id_seq;

ALTER SEQUENCE results_id_seq OWNED BY results.id;


CREATE TABLE sources (
    id bigint NOT NULL,
    results_id bigint NOT NULL,
    name text,
    vip_id text,
    datetime date,
    description text,
    organization_url text,
    feed_contact_id bigint,
    tou_url text
);


ALTER TABLE sources;

CREATE TABLE state_early_vote_sites (
    results_id bigint NOT NULL,
    state_id bigint,
    early_vote_site_id bigint
);


ALTER TABLE state_early_vote_sites;

CREATE TABLE states (
    id bigint NOT NULL,
    results_id bigint NOT NULL,
    name text,
    election_administration_id bigint
);


ALTER TABLE states;

CREATE TABLE statistics (
    id integer NOT NULL,
    results_id integer NOT NULL,
    ballots_count integer,
    ballots_error_count integer,
    ballots_completion integer,
    ballot_line_results_count integer,
    ballot_line_results_error_count integer,
    ballot_line_results_completion integer,
    ballot_responses_count integer,
    ballot_responses_error_count integer,
    ballot_responses_completion integer,
    candidates_count integer,
    candidates_error_count integer,
    candidates_completion integer,
    contests_count integer,
    contests_error_count integer,
    contests_completion integer,
    contest_results_count integer,
    contest_results_error_count integer,
    contest_results_completion integer,
    custom_ballots_count integer,
    custom_ballots_error_count integer,
    custom_ballots_completion integer,
    early_vote_sites_count integer,
    early_vote_sites_error_count integer,
    early_vote_sites_completion integer,
    elections_count integer,
    elections_error_count integer,
    elections_completion integer,
    election_administrations_count integer,
    election_administrations_error_count integer,
    election_administrations_completion integer,
    election_officials_count integer,
    election_officials_error_count integer,
    election_officials_completion integer,
    electoral_districts_count integer,
    electoral_districts_error_count integer,
    electoral_districts_completion integer,
    localities_count integer,
    localities_error_count integer,
    localities_completion integer,
    polling_locations_count integer,
    polling_locations_error_count integer,
    polling_locations_completion integer,
    precincts_count integer,
    precincts_error_count integer,
    precincts_completion integer,
    precinct_splits_count integer,
    precinct_splits_error_count integer,
    precinct_splits_completion integer,
    referendums_count integer,
    referendums_error_count integer,
    referendums_completion integer,
    sources_count integer,
    sources_error_count integer,
    sources_completion integer,
    street_segments_count integer,
    street_segments_error_count integer,
    street_segments_completion integer
);


ALTER TABLE statistics;

CREATE SEQUENCE statistics_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE statistics_id_seq;

ALTER SEQUENCE statistics_id_seq OWNED BY statistics.id;


CREATE TABLE street_segments (
    id bigint NOT NULL,
    results_id bigint NOT NULL,
    start_house_number integer,
    end_house_number integer,
    odd_even_both text,
    start_apartment_number integer,
    end_apartment_number integer,
    non_house_address_house_number integer,
    non_house_address_house_number_prefix text,
    non_house_address_house_number_suffix text,
    non_house_address_street_direction text,
    non_house_address_street_name text,
    non_house_address_street_suffix text,
    non_house_address_address_direction text,
    non_house_address_apartment text,
    non_house_address_city text,
    non_house_address_state text,
    non_house_address_zip text,
    precinct_id bigint,
    precinct_split_id bigint
);


ALTER TABLE street_segments;

CREATE TABLE validations (
    results_id integer,
    severity character varying(255),
    scope character varying(255),
    identifier bigint,
    error_type character varying(255),
    error_data text
);


ALTER TABLE validations;

ALTER TABLE ONLY results ALTER COLUMN id SET DEFAULT nextval('results_id_seq'::regclass);


ALTER TABLE ONLY statistics ALTER COLUMN id SET DEFAULT nextval('statistics_id_seq'::regclass);


COPY ballot_candidates (results_id, ballot_id, candidate_id) FROM stdin;
1	80001	90001
1	80001	90002
1	80001	90003
1	80002	90004
1	80002	90005
1	80003	90006
1	80003	90007
1	80004	90001
1	80004	90002
1	80005	90010
\.


COPY ballot_line_results (id, results_id, contest_id, jurisdiction_id, entire_district, candidate_id, ballot_response_id, votes, overvotes, victorious, certification) FROM stdin;
62006	1	60006	10103	f	\N	120001	150	\N	\N	certified
63006	1	60006	10103	f	\N	120002	100	\N	\N	certified
91008	1	60001	70003	t	90008	\N	510	\N	t	certified
91009	1	60001	70003	t	90009	\N	490	\N	f	certified
\.


COPY ballot_responses (id, results_id, text, sort_order) FROM stdin;
120001	1	Yes	1
120002	1	No	2
120003	1	No	3
\.


COPY ballots (id, results_id, referendum_id, custom_ballot_id, write_in, image_url) FROM stdin;
80001	1	\N	\N	t	http://www.FakeUrl.com
80002	1	\N	\N	\N	xxxx
80003	1	\N	\N	\N	\N
80004	1	\N	\N	t	FakeUrlcom
80005	1	\N	\N	\N	\N
80006	1	\N	\N	\N	\N
80007	1	\N	\N	f	\N
\.


COPY candidates (id, results_id, name, party, candidate_url, biography, phone, photo_url, filed_mailing_address_location_name, filed_mailing_address_line1, filed_mailing_address_line2, filed_mailing_address_line3, filed_mailing_address_city, filed_mailing_address_state, filed_mailing_address_zip, email, sort_order) FROM stdin;
90001	1	Daniel Berlin	Democrat	http://www.dberlin.org	Daniel Berlin grew up somewhere	223-456-7890	http://www.dberlin.org/dannyb.jpg	\N	123 Fake St.	\N	\N	Rockville	OH	20852	dberlin@example----com	1
90002	1	Berlin Opponent	Republican	http://www.berlinOpp.org	Daniel Berlin's opponent grew up somewhere else	223-456-7890	\N	\N	1234 Fake St.	\N	\N	Rockville	OH	20852	dberlinop@example.com	2
90003	1	Third Party Person	Libertarian	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3
90004	1	Goodie Lawyer	Democrat	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
90005	1	Betty Lawschool	Republican	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
90006	1	Goodie Liberal	Democrat	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
90007	1	Carl Moderation	Democrat	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
90008	1	Justin Fication	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
90009	1	Count E. Betterer	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
90010	1	Runner Solo	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


COPY contest_results (id, results_id, contest_id, jurisdiction_id, entire_district, total_votes, total_valid_votes, overvotes, blank_votes, accepted_provisional_votes, rejected_votes, certification) FROM stdin;
61004	1	60001	70003	t	1002	1000	1	1	1	2	certified
61006	1	60006	10103	f	250	\N	\N	\N	\N	\N	certified
\.


COPY contests (id, results_id, election_id, electoral_district_id, type, partisan, primary_party, electorate_specifications, special, office, filing_closed_date, number_elected, number_voting_for, ballot_id, ballot_placement) FROM stdin;
60001	1	1	70003	general	f	\N	\N	\N	County Commisioner	\N	\N	\N	80004	4
60002	1	1	70001	general	t	\N	\N	\N	Attorney General	\N	\N	\N	80002	2
60003	1	1	70002	primary	t	\N	\N	\N	State Senate	\N	\N	\N	80003	3
60004	1	1	70001	general	t	\N	\N	\N	State Treasurer	\N	\N	\N	80001	1
60005	1	1	70003	general	f	\N	\N	\N	County Supervisor At Large	\N	\N	\N	80005	4
60006	1	1	70003	referendum	f	\N	\N	\N	\N	\N	\N	\N	80006	6
60007	1	1	70003	judge retention	f	\N	\N	\N	\N	\N	\N	\N	80007	5
\.


COPY custom_ballot_ballot_responses (results_id, custom_ballot_id, ballot_response_id, sort_order) FROM stdin;
1	90013	120001	\N
1	90013	120002	\N
\.


COPY custom_ballots (id, results_id, heading) FROM stdin;
90013	1	Should Judge Carlton Smith be retained?
\.


COPY early_vote_sites (id, results_id, name, address_location_name, address_line1, address_line2, address_line3, address_city, address_state, address_zip, directions, voter_services, start_date, end_date, days_times_open) FROM stdin;
30203	1	Adams Early Vote Center	Adams County Government Center	321 Main St.	Suite 200	\N	Adams	OH	42224-1	Follow signs to early vote	Early voting is available.	2012-10-01 +02:00:00	2012-11-04 +01:00:00	Mon-Fri: 9am - 6pm. Sat. and Sun.: 10am - 7pm.
30204	1	Springfield Ballot Drop	\N	321 Main St.	\N	\N	Springfield	OH	44444-1	Next to Post Office.	Ballot drop only	2012-10-01 +02:00:00	2012-11-06 +01:00:00	Open all days, all times.
30205	1	05 Adams Early Vote Center	05 Adams County Government Center	321 Main St.	Suite 200	\N	Adams	OH	42224	05 Follow signs to early vote	05 Early voting is available.	2012-10-01 +02:00:00	2012-11-04 +01:00:00	Mon-Fri: 9am - 6pm. Sat. and Sun.: 10am - 7pm.
\.


COPY election_administrations (id, results_id, name, eo_id, ovc_id, physical_address_location_name, physical_address_line1, physical_address_line2, physical_address_line3, physical_address_city, physical_address_state, physical_address_zip, mailing_address_location_name, mailing_address_line1, mailing_address_line2, mailing_address_line3, mailing_address_city, mailing_address_state, mailing_address_zip, elections_url, registration_url, am_i_registered_url, absentee_url, where_do_i_vote_url, what_is_on_my_ballot_url, rules_url, voter_services, hours) FROM stdin;
3456	1	Name1	3457	3458	Government Center	12 Chad Ct.	\N	\N	Columbus	OH	33333	\N	P.O. Box 1776	\N	\N	Columbus	OH	3abcdd-3333	http://www.sos.state.oh.us/sos/ElectionsVoter/ohioElections.aspx	http://www.elections.oh.us/register.html	http://www.elections.oh.us/check_reg.html	http://www.elections.oh.us/early_absentee.html	http://www.elections.oh.us/where_vote.html	http://www.elections.oh.us/ballot_guide.html	http://codes.ohio.gov/orc/35	Early voting and absentee ballot request are available beginning October 1. Voter registration is always available.	M-F 9am-6pm Sat 9am-Noon
3460	1	Name2	3461	3462	2Government Center	12 Chad Ct.	\N	\N	Columbus	OH	33333	\N	2P.O. Box 1776	\N	\N	Columbus	OH	33333xxx	http://www.2sos.state.oh.us/sos/ElectionsVoter/ohioElections.aspx	http://www.2elections.oh.us/register.html	http://www.2elections.oh.us/check_reg.html	http://www.2elections.oh.us/early_absentee.html	http://www.2elections.oh.us/where_vote.html	http://www.2elections.oh.us/ballot_guide.html	http://codes.2ohio.gov/orc/35	2Early voting and absentee ballot request are available beginning October 1. Voter registration is always available.	2M-F 9am-6pm Sat 9am-Noon
\.


COPY election_officials (id, results_id, name, title, phone, fax, email) FROM stdin;
3457	1	Robert Smith	A title	(201) 555-1212	(101) 555-1213	rsmith@ohio.gov
3458	1	Roberta Smith	Head of Elections	(201) 1555-1212	(101) 555-1213	rsmith@ohio.gov
3459	1	Robert Miller	Overseas Voter Contact	(201) 555-1215	(101) 555-1216	rmiller@ohio.gov
3461	1	2Robert Smith	title	(201) 555-1212	(201) 555-1213	2rsmith@ohio.gov
3462	1	2Roberta Smith	2Head of Elections	(201) 555-1212	(201) 555-1213	2rsmith@ohio.gov
1555122	1	Alissa P. Hacker	Information Technology Specialist	(201) 555-1235	(101) 555-1236	ahacker@ohio.gov
\.


COPY elections (id, results_id, absentee_ballot_info, absentee_request_deadline, date, election_day_registration, election_type, polling_hours, registration_deadline, registration_info, results_url, state_id, statewide) FROM stdin;
1	1	http://www.sos.state.oh.us/sos/PublicAffairs/VoterInfoGuide.aspx?Section=16	2012-11-01	2014-04-10	f	Federal	7am-8pm	2012-10-01	http://www.sos.state.oh.us/sos/PublicAffairs/VoterInfoGuide.aspx?Section=14	http://www.sos.state.oh.us/sos/ElectionsVoter/electionResults.aspx	39	t
\.


COPY electoral_districts (id, results_id, name, type, number) FROM stdin;
70001	1	statewide	statewide	\N
70002	1	SD-13	State Senate	\N
70003	1	Ashland County	County	\N
\.


COPY localities (id, results_id, name, state_id, type, election_administration_id) FROM stdin;
101	1	Adams	39	countys	3460
102	1	Allen	39	county	\N
103	1	Ashland	39	wcounty	\N
\.


COPY locality_early_vote_sites (results_id, locality_id, early_vote_site_id) FROM stdin;
1	101	30203
\.


COPY polling_locations (id, results_id, address_location_name, address_line1, address_line2, address_line3, address_city, address_state, address_zip, directions, polling_hours, photo_url) FROM stdin;
20121	1	Springfield Elementary	123 Main St.	\N	\N	Fake Twp	OH	33333_error	Enter through gym door.	7:30am-8:30pm	\N
20122	1	Adams Church	123 Main St.	\N	\N	Adams	OH	33333	Enter through door by parking lot.	\N	\N
20141	1	41 Springfield Elementary	123 Main St.	\N	\N	Fake Twp	OH	33333	41 Enter through gym door.	41 7:30am-8:30pm	\N
20142	1	42 Adams Church	123 Main St.	\N	\N	Adams	OH	33333	42 Enter through door by parking lot.	\N	\N
20201	1	Bath Firehouse Church	123 State St.	\N	\N	Bath	OH	33333_second	Enter through big red door.	\N	\N
20301	1	Ashland City High School	123 Center St.	\N	\N	Ashland	OH	33333	Enter at main doors and take a left.	\N	\N
\.


COPY precinct_early_vote_sites (results_id, precinct_id, early_vote_site_id) FROM stdin;
1	10101	30205
1	10203	30204
\.


COPY precinct_electoral_districts (results_id, precinct_id, electoral_district_id) FROM stdin;
1	10101	70001
1	10101	70003
1	10102	70001
1	10102	70002
1	10102	70003
1	10103	70001
1	10103	70003
1	10201	70001
1	10201	70002
1	10202	70001
1	10202	70002
1	10203	70001
1	10203	70002
1	10301	70001
1	10301	70003
1	10302	70001
1	10302	70002
\.


COPY precinct_polling_locations (results_id, precinct_id, polling_location_id) FROM stdin;
1	10101	20121
1	10102	20122
1	10103	20121
1	10103	20122
1	10201	20201
1	10202	20201
1	10301	20301
1	10302	20301
\.


COPY precinct_split_electoral_districts (results_id, precinct_split_id, electoral_district_id) FROM stdin;
1	44	70001
1	44	70002
1	30101	70001
1	30101	70002
1	30102	70001
1	30102	70003
\.


COPY precinct_split_polling_locations (results_id, precinct_split_id, polling_location_id) FROM stdin;
1	44	20141
1	44	20142
1	44	20121
1	30101	20141
1	30101	20142
1	30101	20121
\.


COPY precinct_splits (id, results_id, name, precinct_id, ballot_style_image_url) FROM stdin;
44	1	Fake Twp-A	10103	http://www.example.com/precinct_split_101_ballot.pdf
111	1	Fake 111	10302	\N
30101	1	Fake Twp-A	10101	http://www.example.com/precinct_split_101_ballot.pdf
30102	1	Fake Twp-B	10101	\N
\.


COPY precincts (id, results_id, name, number, locality_id, ward, mail_only, ballot_style_image_url) FROM stdin;
10101	1	Fake Twp	\N	101	\N	\N	\N
10102	1	Psuedo Twp	\N	101	\N	\N	\N
10103	1	SharesTwoOtherLocations Twp	\N	101	\N	\N	\N
10201	1	Bath Twp A	\N	102	\N	\N	\N
10202	1	Bath Twp B	\N	102	\N	\N	\N
10203	1	Rural Twp Mail In 	\N	102	\N	\N	\N
10301	1	1-A	\N	103	\N	\N	\N
10302	1	1-B	\N	103	\N	\N	\N
\.


COPY ragtime_migrations (id, created_at) FROM stdin;
20150211-01-create-results-table	2015-08-06T15:15:32.865
20150507-01-create-validations-table	2015-08-06T15:15:32.957
20150605-00-create-elections	2015-08-06T15:15:33.009
20150605-01-create-sources	2015-08-06T15:15:33.046
20150605-02-create-states	2015-08-06T15:15:33.100
20150605-03-create-election-administrations	2015-08-06T15:15:33.153
20150605-04-create-election-officials	2015-08-06T15:15:33.205
20150605-05-create-localities	2015-08-06T15:15:33.255
20150605-06-create-precincts	2015-08-06T15:15:33.308
20150605-07-create-early-vote-sites	2015-08-06T15:15:33.342
20150605-08-create-precinct-polling-locations	2015-08-06T15:15:33.373
20150605-09-create-precinct-split-electoral-districts	2015-08-06T15:15:33.418
20150605-10-create-precinct-splits	2015-08-06T15:15:33.469
20150605-11-create-polling-locations	2015-08-06T15:15:33.518
20150605-12-create-street-segments	2015-08-06T15:15:33.562
20150605-13-create-electoral-districts	2015-08-06T15:15:33.607
20150605-14-create-contests	2015-08-06T15:15:33.638
20150605-15-create-ballots	2015-08-06T15:15:33.686
20150605-16-create-ballot-responses	2015-08-06T15:15:33.716
20150605-17-create-referendums	2015-08-06T15:15:33.768
20150605-18-create-referendum-ballot-responses	2015-08-06T15:15:33.810
20150605-19-create-candidates	2015-08-06T15:15:33.861
20150605-20-create-ballot-candidates	2015-08-06T15:15:33.909
20150605-21-create-state-early-vote-sites	2015-08-06T15:15:33.938
20150605-22-create-precinct-split-polling-locations	2015-08-06T15:15:33.982
20150605-23-create-precinct-electoral-districts	2015-08-06T15:15:34.013
20150605-24-create-precinct-early-vote-sites	2015-08-06T15:15:34.044
20150605-25-create-locality-early-vote-sites	2015-08-06T15:15:34.088
20150605-26-custom-ballot-ballot-responses	2015-08-06T15:15:34.136
20150605-27-custom-ballots	2015-08-06T15:15:34.173
20150605-28-contest-results	2015-08-06T15:15:34.220
20150605-29-create-ballot-line-results	2015-08-06T15:15:34.272
20150612-01-create-statistics	2015-08-06T15:15:34.328
20150701-01-index-street-segments-on-precinct-id-and-precinct-split-id	2015-08-06T15:15:34.377
20150715-01-drop-not-nulls	2015-08-06T15:15:34.407
20150723-00-add-exception-to-results	2015-08-06T15:15:34.437
\.


COPY referendum_ballot_responses (results_id, referendum_id, ballot_response_id, sort_order) FROM stdin;
1	90011	120001	\N
1	90011	120002	\N
1	90012	120003	\N
\.


COPY referendums (id, results_id, title, subtitle, brief, text, pro_statement, con_statement, passage_threshold, effect_of_abstain) FROM stdin;
90011	1	Proposition 37	A referendum to ban smoking indoors	A yes vote is a vote to ban smoking indoors.	Shall the State of Ohio ... (full text of referendum as it appears on the ballot).	Vote yes please	Vote no please	three-fifths	Abstaining has no effect
90012	1	Proposition 12	A referendum to...	A yes vote is a vote to...	Shall the State of Ohio ... (full text of referendum as it appears on the ballot).	Vote yes please	Vote no please	three-fifths	Abstaining has no effect
\.


COPY results (id, public_id, start_time, filename, complete, end_time, exception) FROM stdin;
1	2014-04-10-Federal-Ohio-1	2015-08-06 09:15:34.841619-04	vipfeed-39-2014-04-10-1438866936555	t	2015-08-06 09:15:36.55717-04	\N
\.


SELECT pg_catalog.setval('results_id_seq', 1, true);


COPY sources (id, results_id, name, vip_id, datetime, description, organization_url, feed_contact_id, tou_url) FROM stdin;
0	1	State of Ohio	39	2012-10-31	The State of Ohio is the official source of eletion information in Ohio. This feed provides information on election dates, districts, offices, candidates, and precinct boundaries.	http://www.sos.state.oh.us/	1555122	http://www.sos.state.oh.us/vipFeed/terms_of_use.html
\.


COPY state_early_vote_sites (results_id, state_id, early_vote_site_id) FROM stdin;
\.


COPY states (id, results_id, name, election_administration_id) FROM stdin;
39	1	Ohio	3456
\.


COPY statistics (id, results_id, ballots_count, ballots_error_count, ballots_completion, ballot_line_results_count, ballot_line_results_error_count, ballot_line_results_completion, ballot_responses_count, ballot_responses_error_count, ballot_responses_completion, candidates_count, candidates_error_count, candidates_completion, contests_count, contests_error_count, contests_completion, contest_results_count, contest_results_error_count, contest_results_completion, custom_ballots_count, custom_ballots_error_count, custom_ballots_completion, early_vote_sites_count, early_vote_sites_error_count, early_vote_sites_completion, elections_count, elections_error_count, elections_completion, election_administrations_count, election_administrations_error_count, election_administrations_completion, election_officials_count, election_officials_error_count, election_officials_completion, electoral_districts_count, electoral_districts_error_count, electoral_districts_completion, localities_count, localities_error_count, localities_completion, polling_locations_count, polling_locations_error_count, polling_locations_completion, precincts_count, precincts_error_count, precincts_completion, precinct_splits_count, precinct_splits_error_count, precinct_splits_completion, referendums_count, referendums_error_count, referendums_completion, sources_count, sources_error_count, sources_completion, street_segments_count, street_segments_error_count, street_segments_completion) FROM stdin;
1	1	7	5	29	4	0	100	3	0	100	10	3	70	7	5	29	2	0	100	1	0	100	3	0	100	1	0	100	2	0	100	6	4	33	3	0	100	3	0	100	6	1	83	8	0	100	4	1	75	2	0	100	1	0	100	19	78	0
\.


SELECT pg_catalog.setval('statistics_id_seq', 1, true);


COPY street_segments (id, results_id, start_house_number, end_house_number, odd_even_both, start_apartment_number, end_apartment_number, non_house_address_house_number, non_house_address_house_number_prefix, non_house_address_house_number_suffix, non_house_address_street_direction, non_house_address_street_name, non_house_address_street_suffix, non_house_address_address_direction, non_house_address_apartment, non_house_address_city, non_house_address_state, non_house_address_zip, precinct_id, precinct_split_id) FROM stdin;
44	1	15	21	odd	\N	\N	\N	\N	\N	\N	Main	\N	\N	\N	2Rural	OH	43320	10103	\N
45	1	15	21	even	\N	\N	\N	\N	\N	\N	Main	\N	\N	\N	2Rural	OH	43320	10103	\N
46	1	1	10	even	\N	\N	\N	\N	\N	\N	Main	\N	\N	\N	1Rural	OH	43320	10103	\N
47	1	15	21	even	\N	\N	\N	\N	\N	\N	Main	\N	\N	\N	1Rural	OH	43320	10103	\N
48	1	15	21	even	\N	\N	\N	\N	\N	\N	Main	\N	\N	\N	3Rural	OH	43320	10103	\N
49	1	15	21	both	\N	\N	\N	\N	\N	\N	Main	\N	\N	\N	3Rurala	OH	43320	10103	\N
101	1	15	21	odd	\N	\N	\N	\N	\N	\N	Main	\N	\N	\N	Rural	OH	43320	10103	\N
222	1	0	20	both	\N	\N	\N	\N	\N	\N	Main	\N	\N	\N	Rural	OH	43320	10302	\N
223	1	1	20	both	\N	\N	\N	\N	\N	\N	Main	\N	\N	\N	Rural	OH	43320	10302	\N
224	1	15	21	odd	\N	\N	\N	\N	\N	\N	Main	\N	\N	\N	Rural	OH	43320	10103	\N
1210001	1	1	12	both	\N	\N	\N	\N	\N	eE	Guineveres	Dr	SE	616S	Annandale	VA	22003	10101	\N
1210002	1	1	10	even	\N	\N	\N	\N	\N	Es	Guineveres	Dr	SE	0	Annandale	VA	22003	10101	\N
1210003	1	1	10	both	\N	\N	\N	\N	\N	E	Guinevere	Dr	wSE	616S	Annandale	VA	22003	10101	\N
1210004	1	1	9999998	even	\N	\N	\N	\N	\N	E	Main	Dr	N	\N	Annandale	OH	43321	10203	\N
1210005	1	1	9999999	even	\N	\N	\N	\N	\N	\N	Main	\N	\N	\N	Rural	OH	43320	10101	\N
1210006	1	1	9999999	even	\N	\N	\N	\N	\N	\N	Main	\N	\N	\N	Rural	OH	43320	10101	\N
1210007	1	1	20	both	\N	\N	\N	\N	\N	\N	Main	\N	\N	\N	Rural	OH	43320	10101	\N
1210008	1	1	2	both	\N	\N	\N	\N	\N	\N	Main	\N	\N	\N	Rural	OH	43320	10101	\N
1210009	1	1	2	both	\N	\N	\N	\N	\N	\N	Main	\N	\N	\N	Rural	OH	43320	10101	\N
\.


COPY validations (results_id, severity, scope, identifier, error_type, error_data) FROM stdin;
1	warnings	ballots	80003	duplicate-rows	{:id 80003, :referendum_id nil, :custom_ballot_id nil, :write_in nil, :image_url nil}
1	warnings	election-officials	3458	unreferenced-row	{:id 3458, :name "Roberta Smith", :title "Head of Elections", :phone "(201) 1555-1212", :fax "(101) 555-1213", :email "rsmith@ohio.gov"}
1	warnings	contests	60007	unreferenced-row	{:special nil, :filing_closed_date nil, :number_voting_for nil, :ballot_id 80007, :type "judge retention", :electoral_district_id 70003, :ballot_placement 5, :partisan 0, :office nil, :id 60007, :electorate_specifications nil, :number_elected nil, :primary_party nil, :election_id 1}
1	warnings	ballots	80005	duplicate-rows	{:id 80005, :referendum_id nil, :custom_ballot_id nil, :write_in nil, :image_url nil}
1	warnings	street-segments	1210005	duplicate-rows	{:non_house_address_street_suffix nil, :precinct_id 10101, :odd_even_both "even", :non_house_address_street_direction nil, :non_house_address_city "Rural", :non_house_address_address_direction nil, :non_house_address_house_number nil, :non_house_address_zip "43320", :id 1210005, :non_house_address_apartment nil, :non_house_address_house_number_prefix nil, :end_house_number 9999999, :start_house_number 1, :non_house_address_house_number_suffix nil, :start_apartment_number nil, :precinct_split_id nil, :non_house_address_street_name "Main", :end_apartment_number nil, :non_house_address_state "OH"}
1	warnings	contests	60004	unreferenced-row	{:special nil, :filing_closed_date nil, :number_voting_for nil, :ballot_id 80001, :type "general", :electoral_district_id 70001, :ballot_placement 1, :partisan 1, :office "State Treasurer", :id 60004, :electorate_specifications nil, :number_elected nil, :primary_party nil, :election_id 1}
1	warnings	ballots	80006	duplicate-rows	{:id 80006, :referendum_id nil, :custom_ballot_id nil, :write_in nil, :image_url nil}
1	warnings	street-segments	224	duplicate-rows	{:non_house_address_street_suffix nil, :precinct_id 10103, :odd_even_both "odd", :non_house_address_street_direction nil, :non_house_address_city "Rural", :non_house_address_address_direction nil, :non_house_address_house_number nil, :non_house_address_zip "43320", :id 224, :non_house_address_apartment nil, :non_house_address_house_number_prefix nil, :end_house_number 21, :start_house_number 15, :non_house_address_house_number_suffix nil, :start_apartment_number nil, :precinct_split_id nil, :non_house_address_street_name "Main", :end_apartment_number nil, :non_house_address_state "OH"}
1	warnings	election-officials	3459	unreferenced-row	{:id 3459, :name "Robert Miller", :title "Overseas Voter Contact", :phone "(201) 555-1215", :fax "(101) 555-1216", :email "rmiller@ohio.gov"}
1	warnings	street-segments	101	duplicate-rows	{:non_house_address_street_suffix nil, :precinct_id 10103, :odd_even_both "odd", :non_house_address_street_direction nil, :non_house_address_city "Rural", :non_house_address_address_direction nil, :non_house_address_house_number nil, :non_house_address_zip "43320", :id 101, :non_house_address_apartment nil, :non_house_address_house_number_prefix nil, :end_house_number 21, :start_house_number 15, :non_house_address_house_number_suffix nil, :start_apartment_number nil, :precinct_split_id nil, :non_house_address_street_name "Main", :end_apartment_number nil, :non_house_address_state "OH"}
1	warnings	contests	60002	unreferenced-row	{:special nil, :filing_closed_date nil, :number_voting_for nil, :ballot_id 80002, :type "general", :electoral_district_id 70001, :ballot_placement 2, :partisan 1, :office "Attorney General", :id 60002, :electorate_specifications nil, :number_elected nil, :primary_party nil, :election_id 1}
1	warnings	contests	60005	unreferenced-row	{:special nil, :filing_closed_date nil, :number_voting_for nil, :ballot_id 80005, :type "general", :electoral_district_id 70003, :ballot_placement 4, :partisan 0, :office "County Supervisor At Large", :id 60005, :electorate_specifications nil, :number_elected nil, :primary_party nil, :election_id 1}
1	warnings	contests	60003	unreferenced-row	{:special nil, :filing_closed_date nil, :number_voting_for nil, :ballot_id 80003, :type "primary", :electoral_district_id 70002, :ballot_placement 3, :partisan 1, :office "State Senate", :id 60003, :electorate_specifications nil, :number_elected nil, :primary_party nil, :election_id 1}
1	warnings	street-segments	1210008	duplicate-rows	{:non_house_address_street_suffix nil, :precinct_id 10101, :odd_even_both "both", :non_house_address_street_direction nil, :non_house_address_city "Rural", :non_house_address_address_direction nil, :non_house_address_house_number nil, :non_house_address_zip "43320", :id 1210008, :non_house_address_apartment nil, :non_house_address_house_number_prefix nil, :end_house_number 2, :start_house_number 1, :non_house_address_house_number_suffix nil, :start_apartment_number nil, :precinct_split_id nil, :non_house_address_street_name "Main", :end_apartment_number nil, :non_house_address_state "OH"}
1	warnings	precinct-splits	111	unreferenced-row	{:id 111, :name "Fake 111", :precinct_id 10302, :ballot_style_image_url nil}
1	warnings	street-segments	1210009	duplicate-rows	{:non_house_address_street_suffix nil, :precinct_id 10101, :odd_even_both "both", :non_house_address_street_direction nil, :non_house_address_city "Rural", :non_house_address_address_direction nil, :non_house_address_house_number nil, :non_house_address_zip "43320", :id 1210009, :non_house_address_apartment nil, :non_house_address_house_number_prefix nil, :end_house_number 2, :start_house_number 1, :non_house_address_house_number_suffix nil, :start_apartment_number nil, :precinct_split_id nil, :non_house_address_street_name "Main", :end_apartment_number nil, :non_house_address_state "OH"}
1	warnings	street-segments	1210006	duplicate-rows	{:non_house_address_street_suffix nil, :precinct_id 10101, :odd_even_both "even", :non_house_address_street_direction nil, :non_house_address_city "Rural", :non_house_address_address_direction nil, :non_house_address_house_number nil, :non_house_address_zip "43320", :id 1210006, :non_house_address_apartment nil, :non_house_address_house_number_prefix nil, :end_house_number 9999999, :start_house_number 1, :non_house_address_house_number_suffix nil, :start_apartment_number nil, :precinct_split_id nil, :non_house_address_street_name "Main", :end_apartment_number nil, :non_house_address_state "OH"}
1	warnings	election-officials	3462	unreferenced-row	{:id 3462, :name "2Roberta Smith", :title "2Head of Elections", :phone "(201) 555-1212", :fax "(201) 555-1213", :email "2rsmith@ohio.gov"}
1	errors	street-segments	44	overlaps	224
1	errors	street-segments	44	overlaps	1210007
1	errors	street-segments	44	overlaps	222
1	errors	street-segments	44	overlaps	223
1	errors	street-segments	44	overlaps	101
1	errors	street-segments	44	overlaps	49
1	errors	street-segments	1210003	non_house_address_address_direction	"Invalid street direction"
1	errors	street-segments	1210008	overlaps	1210009
1	errors	candidates	90002	phone	"Invalid phone number format"
1	errors	street-segments	1210001	non_house_address_street_direction	"Invalid street direction"
1	errors	street-segments	222	overlaps	1210005
1	errors	street-segments	222	overlaps	1210007
1	errors	street-segments	222	overlaps	1210008
1	errors	street-segments	222	overlaps	223
1	errors	street-segments	222	overlaps	1210006
1	errors	street-segments	222	overlaps	224
1	errors	street-segments	222	overlaps	1210009
1	errors	street-segments	1210005	overlaps	1210008
1	errors	street-segments	1210005	overlaps	1210009
1	errors	street-segments	1210005	overlaps	1210006
1	errors	street-segments	1210005	overlaps	1210007
1	errors	street-segments	48	overlaps	1210005
1	errors	street-segments	48	overlaps	1210006
1	errors	street-segments	48	overlaps	222
1	errors	street-segments	48	overlaps	223
1	errors	street-segments	48	overlaps	49
1	errors	street-segments	48	overlaps	1210007
1	errors	street-segments	46	overlaps	222
1	errors	street-segments	46	overlaps	1210006
1	errors	street-segments	46	overlaps	1210008
1	errors	street-segments	46	overlaps	1210005
1	errors	street-segments	46	overlaps	1210009
1	errors	street-segments	46	overlaps	223
1	errors	street-segments	46	overlaps	1210007
1	errors	street-segments	224	overlaps	1210007
1	errors	election-officials	3458	phone	"Invalid phone number format"
1	errors	polling-locations	20142	photo_url	"Invalid url format"
1	errors	street-segments	45	overlaps	1210006
1	errors	street-segments	45	overlaps	47
1	errors	street-segments	45	overlaps	223
1	errors	street-segments	45	overlaps	1210005
1	errors	street-segments	45	overlaps	48
1	errors	street-segments	45	overlaps	222
1	errors	street-segments	45	overlaps	1210007
1	errors	street-segments	45	overlaps	49
1	errors	street-segments	1210006	overlaps	1210008
1	errors	street-segments	1210006	overlaps	1210007
1	errors	street-segments	1210006	overlaps	1210009
1	errors	candidates	90001	email	"Invalid email format"
1	errors	street-segments	223	overlaps	1210009
1	errors	street-segments	223	overlaps	1210006
1	errors	street-segments	223	overlaps	1210007
1	errors	street-segments	223	overlaps	1210005
1	errors	street-segments	223	overlaps	224
1	errors	street-segments	223	overlaps	1210008
1	errors	import	101	duplicate-ids	"street_segments"
1	errors	import	101	duplicate-ids	"localities"
1	errors	ballots	80002	image_url	"Invalid url format"
1	errors	street-segments	1210002	non_house_address_street_direction	"Invalid street direction"
1	errors	street-segments	1210007	overlaps	1210009
1	errors	street-segments	1210007	overlaps	1210008
1	errors	street-segments	101	overlaps	223
1	errors	street-segments	101	overlaps	1210007
1	errors	street-segments	101	overlaps	222
1	errors	street-segments	101	overlaps	224
1	errors	ballots	80004	image_url	"Invalid url format"
1	errors	street-segments	47	overlaps	49
1	errors	street-segments	47	overlaps	222
1	errors	street-segments	47	overlaps	223
1	errors	street-segments	47	overlaps	48
1	errors	street-segments	47	overlaps	1210006
1	errors	street-segments	47	overlaps	1210007
1	errors	street-segments	47	overlaps	1210005
1	errors	import	44	duplicate-ids	"street_segments"
1	errors	import	44	duplicate-ids	"precinct_splits"
1	errors	street-segments	49	overlaps	1210007
1	errors	street-segments	49	overlaps	223
1	errors	street-segments	49	overlaps	222
1	errors	street-segments	49	overlaps	1210006
1	errors	street-segments	49	overlaps	224
1	errors	street-segments	49	overlaps	101
1	errors	street-segments	49	overlaps	1210005
1	errors	candidates	90001	phone	"Invalid phone number format"
\.


ALTER TABLE ONLY ballot_line_results
    ADD CONSTRAINT ballot_line_results_pkey PRIMARY KEY (results_id, id);


ALTER TABLE ONLY ballot_responses
    ADD CONSTRAINT ballot_responses_pkey PRIMARY KEY (results_id, id);


ALTER TABLE ONLY ballots
    ADD CONSTRAINT ballots_pkey PRIMARY KEY (results_id, id);


ALTER TABLE ONLY candidates
    ADD CONSTRAINT candidates_pkey PRIMARY KEY (results_id, id);


ALTER TABLE ONLY contest_results
    ADD CONSTRAINT contest_results_pkey PRIMARY KEY (results_id, id);


ALTER TABLE ONLY contests
    ADD CONSTRAINT contests_pkey PRIMARY KEY (results_id, id);


ALTER TABLE ONLY custom_ballots
    ADD CONSTRAINT custom_ballots_pkey PRIMARY KEY (results_id, id);


ALTER TABLE ONLY early_vote_sites
    ADD CONSTRAINT early_vote_sites_pkey PRIMARY KEY (results_id, id);


ALTER TABLE ONLY election_administrations
    ADD CONSTRAINT election_administrations_pkey PRIMARY KEY (results_id, id);


ALTER TABLE ONLY election_officials
    ADD CONSTRAINT election_officials_pkey PRIMARY KEY (results_id, id);


ALTER TABLE ONLY elections
    ADD CONSTRAINT elections_pkey PRIMARY KEY (results_id, id);


ALTER TABLE ONLY electoral_districts
    ADD CONSTRAINT electoral_districts_pkey PRIMARY KEY (results_id, id);


ALTER TABLE ONLY localities
    ADD CONSTRAINT localities_pkey PRIMARY KEY (results_id, id);


ALTER TABLE ONLY polling_locations
    ADD CONSTRAINT polling_locations_pkey PRIMARY KEY (results_id, id);


ALTER TABLE ONLY precinct_splits
    ADD CONSTRAINT precinct_splits_pkey PRIMARY KEY (results_id, id);


ALTER TABLE ONLY precincts
    ADD CONSTRAINT precincts_pkey PRIMARY KEY (results_id, id);


ALTER TABLE ONLY referendums
    ADD CONSTRAINT referendums_pkey PRIMARY KEY (results_id, id);


ALTER TABLE ONLY results
    ADD CONSTRAINT results_pkey PRIMARY KEY (id);


ALTER TABLE ONLY results
    ADD CONSTRAINT results_public_id_key UNIQUE (public_id);


ALTER TABLE ONLY sources
    ADD CONSTRAINT sources_pkey PRIMARY KEY (results_id, id);


ALTER TABLE ONLY states
    ADD CONSTRAINT states_pkey PRIMARY KEY (results_id, id);


ALTER TABLE ONLY statistics
    ADD CONSTRAINT statistics_pkey PRIMARY KEY (id);


ALTER TABLE ONLY street_segments
    ADD CONSTRAINT street_segments_pkey PRIMARY KEY (results_id, id);


CREATE INDEX street_segments_precinct_id_idx ON street_segments USING btree (precinct_id);


CREATE INDEX street_segments_precinct_split_id_idx ON street_segments USING btree (precinct_split_id);


CREATE INDEX validations_result_scope_id_idx ON validations USING btree (results_id, scope, identifier);


CREATE INDEX validations_result_scope_type_idx ON validations USING btree (results_id, scope, error_type);


ALTER TABLE ONLY ballot_candidates
    ADD CONSTRAINT ballot_candidates_results_id_fkey FOREIGN KEY (results_id) REFERENCES results(id);


ALTER TABLE ONLY ballot_line_results
    ADD CONSTRAINT ballot_line_results_results_id_fkey FOREIGN KEY (results_id) REFERENCES results(id);


ALTER TABLE ONLY ballot_responses
    ADD CONSTRAINT ballot_responses_results_id_fkey FOREIGN KEY (results_id) REFERENCES results(id);


ALTER TABLE ONLY ballots
    ADD CONSTRAINT ballots_results_id_fkey FOREIGN KEY (results_id) REFERENCES results(id);


ALTER TABLE ONLY candidates
    ADD CONSTRAINT candidates_results_id_fkey FOREIGN KEY (results_id) REFERENCES results(id);


ALTER TABLE ONLY contest_results
    ADD CONSTRAINT contest_results_results_id_fkey FOREIGN KEY (results_id) REFERENCES results(id);


ALTER TABLE ONLY contests
    ADD CONSTRAINT contests_results_id_fkey FOREIGN KEY (results_id) REFERENCES results(id);


ALTER TABLE ONLY custom_ballot_ballot_responses
    ADD CONSTRAINT custom_ballot_ballot_responses_results_id_fkey FOREIGN KEY (results_id) REFERENCES results(id);


ALTER TABLE ONLY custom_ballots
    ADD CONSTRAINT custom_ballots_results_id_fkey FOREIGN KEY (results_id) REFERENCES results(id);


ALTER TABLE ONLY early_vote_sites
    ADD CONSTRAINT early_vote_sites_results_id_fkey FOREIGN KEY (results_id) REFERENCES results(id);


ALTER TABLE ONLY election_administrations
    ADD CONSTRAINT election_administrations_results_id_fkey FOREIGN KEY (results_id) REFERENCES results(id);


ALTER TABLE ONLY election_officials
    ADD CONSTRAINT election_officials_results_id_fkey FOREIGN KEY (results_id) REFERENCES results(id);


ALTER TABLE ONLY elections
    ADD CONSTRAINT elections_results_id_fkey FOREIGN KEY (results_id) REFERENCES results(id);


ALTER TABLE ONLY electoral_districts
    ADD CONSTRAINT electoral_districts_results_id_fkey FOREIGN KEY (results_id) REFERENCES results(id);


ALTER TABLE ONLY localities
    ADD CONSTRAINT localities_results_id_fkey FOREIGN KEY (results_id) REFERENCES results(id);


ALTER TABLE ONLY locality_early_vote_sites
    ADD CONSTRAINT locality_early_vote_sites_results_id_fkey FOREIGN KEY (results_id) REFERENCES results(id);


ALTER TABLE ONLY polling_locations
    ADD CONSTRAINT polling_locations_results_id_fkey FOREIGN KEY (results_id) REFERENCES results(id);


ALTER TABLE ONLY precinct_early_vote_sites
    ADD CONSTRAINT precinct_early_vote_sites_results_id_fkey FOREIGN KEY (results_id) REFERENCES results(id);


ALTER TABLE ONLY precinct_electoral_districts
    ADD CONSTRAINT precinct_electoral_districts_results_id_fkey FOREIGN KEY (results_id) REFERENCES results(id);


ALTER TABLE ONLY precinct_polling_locations
    ADD CONSTRAINT precinct_polling_locations_results_id_fkey FOREIGN KEY (results_id) REFERENCES results(id);


ALTER TABLE ONLY precinct_split_electoral_districts
    ADD CONSTRAINT precinct_split_electoral_districts_results_id_fkey FOREIGN KEY (results_id) REFERENCES results(id);


ALTER TABLE ONLY precinct_split_polling_locations
    ADD CONSTRAINT precinct_split_polling_locations_results_id_fkey FOREIGN KEY (results_id) REFERENCES results(id);


ALTER TABLE ONLY precinct_splits
    ADD CONSTRAINT precinct_splits_results_id_fkey FOREIGN KEY (results_id) REFERENCES results(id);


ALTER TABLE ONLY precincts
    ADD CONSTRAINT precincts_results_id_fkey FOREIGN KEY (results_id) REFERENCES results(id);


ALTER TABLE ONLY referendum_ballot_responses
    ADD CONSTRAINT referendum_ballot_responses_results_id_fkey FOREIGN KEY (results_id) REFERENCES results(id);


ALTER TABLE ONLY referendums
    ADD CONSTRAINT referendums_results_id_fkey FOREIGN KEY (results_id) REFERENCES results(id);


ALTER TABLE ONLY sources
    ADD CONSTRAINT sources_results_id_fkey FOREIGN KEY (results_id) REFERENCES results(id);


ALTER TABLE ONLY state_early_vote_sites
    ADD CONSTRAINT state_early_vote_sites_results_id_fkey FOREIGN KEY (results_id) REFERENCES results(id);


ALTER TABLE ONLY states
    ADD CONSTRAINT states_results_id_fkey FOREIGN KEY (results_id) REFERENCES results(id);


ALTER TABLE ONLY statistics
    ADD CONSTRAINT statistics_results_id_fkey FOREIGN KEY (results_id) REFERENCES results(id);


ALTER TABLE ONLY street_segments
    ADD CONSTRAINT street_segments_results_id_fkey FOREIGN KEY (results_id) REFERENCES results(id);


REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

