var translator = function(translations) {
  return function() {
    return function(input) {
      return translations[input] || input;
    }
  }
};

var severities = {
  warnings: 'Warning',
  errors: 'Error',
  critical: 'Critical',
  fatal: 'Fatal'
};

var errorScope = {
  "ballots": "Ballots",
  "ballot-candidates": "Ballot-Candidates",
  "ballot-line-results": "Ballot-Line Results",
  "ballot-responses": "Ballot Responses",
  "candidates": "Candidates",
  "contests": "Contests",
  "contest-results": "Contest Results",
  "custom-ballots": "Custom Ballots",
  "custom-ballot-ballot-responses": "Custom Ballot-Ballot Responses",
  "early-vote-sites": "Early Vote Sites",
  "elections": "Elections",
  "election-administrations": "Election Administrations",
  "election-officials": "Election Officials",
  "electoral-districts": "Electoral Districts",
  "localities": "Localities",
  "locality-early-vote-sites": "Locality-Early Vote Sites",
  "polling-locations": "Polling Locations",
  "precincts": "Precincts",
  "precinct-splits": "Precinct Splits",
  "precinct-early-vote-sites": "Precinct-Early Vote Sites",
  "precinct-electoral-districts": "Precinct-Electoral Districts",
  "precinct-polling-locations": "Precinct-Polling Locations",
  "precinct-split-electoral-districts": "Precinct Split-Electoral Districts",
  "precinct-split-polling-locations": "Precinct Split-Polling Locations",
  "referendums": "Referendums",
  "referendum-ballot-responses": "Referendum-Ballot Responses",
  "state-early-vote-sites": "State-Early Vote Sites",
  "street-segments": "Street Segments",
  "sources": "Source",
  "states": "State",
  'xml-generation': 'XML Generation'
};

var errorTitles = {
 'absentee_ballot_info': 'Invalid url format',
  'absentee_request_deadline': 'Invalid date format',
  'absentee_url': 'Invalid url format',
  'accepted_provisional_votes': 'Invalid data type',
  'address_city': 'Missing address_city',
  'address_line1': 'Missing address_line1',
  'address_state': 'Missing address_state',
  'am_i_registered_url': 'Invalid url format',
  'bad-filenames': 'CSV files named incorrectly',
  'ballot_id': 'Invalid data type',
  'ballot_placement': 'Invalid data type',
  'ballot_response_id': 'Invalid data type',
  'ballot_style_image_url': 'Invalid url format',
  'blank_votes': 'Invalid data type',
  'candidate_id': 'Invalid data type',
  'candidate_url': 'Invalid url format',
  'contest_id': 'Invalid data type',
  'custom_ballot_id': 'Invalid data type',
  'date': 'Invalid date format',
  'datetime': 'Invalid datetime format',
  'duplicate-ids': 'Duplicate IDs',
  'duplicate-rows': 'Duplicate records',
  'early_vote_site_id': 'Invalid data type',
  'election_administration_id': 'Invalid data type',
  'election_day_registration': 'Must be yes or no',
  'election_id': 'Invalid data type',
  'election_type': 'Invalid type',
  'elections_url': 'Invalid url format',
  'electoral_district_id': 'Invalid data type',
  'email': 'Invalid email format',
  'end_apartment_number': 'Invalid data type',
  'end_date': 'Invalid date format',
  'end_house_number': 'Invalid data type',
  'end-house-number': 'Invalid data type',
  'entire_district': 'Must be yes or no',
  'eo_id': 'Invalid data type',
  'extraneous-headers': 'Extraneous headers',
  'fax': 'Invalid phone number format',
  'feed_contact_id': 'Invalid data type',
  'filing_closed_date': 'Invalid date format',
  'heading': 'Missing heading',
  'id': 'Invalid data type',
  'image_url': 'Invalid url format',
  'incomplete-mailing-address': 'Incomplete mailing address',
  'incomplete-physical-address': 'Incomplete physical address',
  'invalid-vip-id': 'Invalid VIP ID',
  'invalid-xml': 'Generated XML is invalid',
  'jurisdiction_id': 'Invalid data type',
  'locality_id': 'Invalid data type',
  'mail_only': 'Must be yes or no',
  'missing-csv': 'Missing CSV',
  'missing-dependency': 'Missing dependency',
  'missing-headers': 'Missing headers',
  'name': 'Missing name',
  'non_house_address_address_direction': 'Invalid street direction',
  'non_house_address_house_number': 'Invalid data type',
  'non_house_address_street_direction': 'Invalid street direction',
  'number': 'Invalid data type',
  'number_elected': 'Invalid data type',
  'number-of-values': 'Unexpected number of values',
  'number_voting_for': 'Invalid data type',
  'odd_even_both': 'Must be \"odd\", \"even\", or \"both\"',
  'organization_url': 'Invalid url format',
  'ovc_id': 'Invalid data type',
  'overlaps': 'Overlapping street segments',
  'overvotes': 'Invalid data type',
  'partisan': 'Must be yes or no',
  'phone': 'Invalid phone number format',
  'photo_url': 'Invalid url format',
  'polling_location_id': 'Invalid data type',
  'precinct_id': 'Invalid data type',
  'precinct_split_id': 'Invalid data type',
  'referendum_id': 'Invalid data type',
  'registration_deadline': 'Invalid date format',
  'registration_info': 'Invalid url format',
  'registration_url': 'Invalid url format',
  'rejected_votes': 'Invalid data type',
  'results_url': 'Invalid url format',
  'row-constraint': 'Row constraint',
  'rules_url': 'Invalid url format',
  'sort_order': 'Invalid data type',
  'special': 'Must be yes or no',
  'start_apartment_number': 'Invalid data type',
  'start_date': 'Invalid date format',
  'start_house_number': 'Invalid data type',
  'start-house-number': 'Invalid data type',
  'state_id': 'Invalid data type',
  'statewide': 'Must be yes or no',
  'text': 'Missing text',
  'title': 'Missing title',
  'total_votes': 'Invalid data type',
  'total_valid_votes': 'Invalid data type',
  'tou_url': 'Invalid data type',
  'type': 'Invalid type',
  'unknown-tag': 'Unknown tag',
  'unmatched-reference': 'Unmatched reference',
  'unreferenced-row': 'Unreferenced row',
  'votes': 'Invalid data type',
  'victorious': 'Must be yes or no',
  'vip_id': 'Invalid data type',
  'what_is_on_my_ballot_url': 'Invalid url format',
  'where_do_i_vote_url': 'Invalid url format',
  'write_in': 'Must be yes or no'
};

var errorDescriptions = {
  'absentee_ballot_info': 'Url must conform to the format: http[?s]://<domain>.<org>',
  'absentee_url': 'Url must conform to the format: http[?s]://<domain>.<org>',
  'accepted_provisional_votes': 'Must be all digits',
  'absentee_request_deadline': 'Date must conform to the format YYYY-MM-DDTHH:MM:SS (e.g. 2012-04-29T18:06:46)',
  'address_city': 'Must exist',
  'address_line1': 'Must exist',
  'address_state': 'Must exist',
  'am_i_registered_url': 'Url must conform to the format: http[?s]://<domain>.<org>',
  'ballot_id': 'Must exist and/or be all digits.',
  'ballot_placement': 'Must be all digits',
  'ballot_response_id': 'Must exist and/or be all digits.',
  'ballot_style_image_url': 'Url must conform to the format: http[?s]://<domain>.<org>',
  'blank_votes': 'Must be all digits',
  'candidate_id': 'Must exist and/or be all digits.',
  'candidate_url': 'Url must conform to the format: http[?s]://<domain>.<org>',
  'contest_id': 'Must exist and/or be all digits.',
  'custom_ballot_id': 'Must exist and/or be all digits.',
  'date': 'Must exist and date must conform to the format YYYY-MM-DDTHH:MM:SS (e.g. 2012-04-29T18:06:46)',
  'datetime': 'Must exist and datetime must conform to the format YYYY-MM-DDTHH:MM:SS (e.g. 2012-04-29T18:06:46)',
  'early_vote_site_id': 'Must exist and/or be all digits.',
  'election_administration_id': 'Must exist and/or be all digits.',
  'election_day_registration': 'Must be the words "yes" or "no"',
  'election_id': 'Must exist and/or be all digits.',
  'elections_url': 'Url must conform to the format: http[?s]://<domain>.<org>',
  'electoral_district_id': 'Must exist and/or be all digits.',
  'election_type': 'Must be one of the following, exactly: "Federal", "State", "County", "City", or "Town"',
  'email': 'Email must conform to the format: <username>@<domain>',
  'end_apartment_number': 'Must be all digits',
  'end_date': 'Date must conform to the format YYYY-MM-DDTHH:MM:SS (e.g. 2012-04-29T18:06:46)',
  'end_house_number': 'Must exist',
  'end-house-number': 'EndHouseNumber must be an integer',
  'eo_id': 'Must be all digits',
  'entire_district': 'Must exist and/or be the words "yes" or "no"',
  'fax': 'Number must conform to the format: d[2-9]dd-ddd-dddd (e.g. 555-555-5555)',
  'feed_contact_id': 'Must be all digits',
  'filing_closed_date': 'Date must conform to the format YYYY-MM-DDTHH:MM:SS (e.g. 2012-04-29T18:06:46)',
  'heading': 'Must exist',
  'id': 'Must exist and be all digits.',
  'image_url': 'Url must conform to the format: http[?s]://<domain>.<org>',
  'jurisdiction_id': 'Must exist and/or be all digits.',
  'locality_id': 'Must exist and/or be all digits.',
  'mail_only': 'Must exist and/or be the words "yes" or "no"',
  'name': 'Must exist',
  'non_house_address_address_direction': 'Street Direction must be one of the following: "N", "S", "E", "W", "NW", "NE", "SW", or "SE"',
  'non_house_address_house_number': 'Must be all digits',
  'non_house_address_street_direction': 'Street Direction must be one of the following: "N", "S", "E", "W", "NW", "NE", "SW", or "SE"',
  'number': 'Must be all digits',
  'number_elected': 'Must be all digits',
  'number_voting_for': 'Must be all digits',
  'odd_even_both': 'Must be one of the following: "odd", "even", or "both"',
  'organization_url': 'Url must conform to the format: http[?s]://<domain>.<org>',
  'ovc_id': 'Must be all digits',
  'overvotes': 'Must be all digits',
  'partisan': 'Must be the words "yes" or "no"',
  'phone': 'Number must conform to the format: d[2-9]dd-ddd-dddd (e.g. 555-555-5555)',
  'photo_url': 'Url must conform to the format: http[?s]://<domain>.<org>',
  'polling_location_id': 'Must exist and/or be all digits.',
  'precinct_id': 'Must exist and/or be all digits.',
  'precinct_split_id': 'Must exist and/or be all digits.',
  'referendum_id': 'Must exist and/or be all digits.',
  'registration_deadline': 'Date must conform to the format YYYY-MM-DDTHH:MM:SS (e.g. 2012-04-29T18:06:46)',
  'registration_info': 'Url must conform to the format: http[?s]://<domain>.<org>',
  'registration_url': 'Url must conform to the format: http[?s]://<domain>.<org>',
  'rejected_votes': 'Must be all digits',
  'results_url': 'Url must conform to the format: http[?s]://<domain>.<org>',
  'rules_url': 'Url must conform to the format: http[?s]://<domain>.<org>',
  'sort_order': 'Must be all digits',
  'special': 'Must be the words "yes" or "no"',
  'start_apartment_number': 'Must be all digits',
  'start_date': 'Date must conform to the format YYYY-MM-DDTHH:MM:SS (e.g. 2012-04-29T18:06:46)',
  'start_house_number': 'Must exist',
  'start-house-number': 'StartHouseNumber must be an integer',
  'state_id': 'Must exist and/or be all digits.',
  'statewide': 'Must be the words "yes" or "no"',
  'text': 'Must exist',
  'title': 'Must exist',
  'total_votes': 'Must be all digits',
  'total_valid_votes': 'Must be all digits',
  'tou_url': 'Url must conform to the format: http[?s]://<domain>.<org>',
  'vip_id': 'Must exist and be all digits.',
  'victorious': 'Must be the words "yes" or "no"',
  'votes': 'Must exist and be all digits.',
  'what_is_on_my_ballot_url': 'Url must conform to the format: http[?s]://<domain>.<org>',
  'where_do_i_vote_url': 'Url must conform to the format: http[?s]://<domain>.<org>',
  'write_in': 'Must be the words "yes" or "no"',

  'bad-filenames': 'CSV files must be comma-delimited .txt files and be correctly named',
  'duplicate-ids': 'No duplicated IDs throughout fileset',
  'duplicate-rows': 'There should be no duplicate records within the file',
  'extraneous-headers': 'Extra headers included in a .txt file',
  'incomplete-mailing-address': 'Election administration addresses must be complete',
  'incomplete-physical-address': 'Election administration addresses must be complete',
  'invalid-vip-id': 'Source file must contain valid FIPS for vip_id',
  'invalid-xml': 'The XML generated from processing the feed is invalid',
  'missing-csv': 'An essential CSV file is missing',
  'missing-dependency': 'CSV files have additional, dependent files which have not been provided',
  'missing-headers': 'Required headers missing from a .txt file',
  'missing': 'A required element is missing',
  'multiple-polling-locations-mappings': 'In the 5.1/5.2 formats, polling location IDs should be referenced in locality.txt if the location is available to all voters in the locality, or in precinct.txt if the location is available to only specific voters in the locality.',
  'number-of-values': 'Number of columns and number of values do not match',
  'overlaps': 'Street segments must not overlap',
  'row-constraint': 'Specified files must only contain one record: source, election, state',
  'unknown-tag': 'Unknown tags included in XML file',
  'unmatched-reference': 'Element references another element that does not appear in this data set',
  'unreferenced-row': 'Element should be referred to by another element but is not referenced anywhere in this data set'
};

var electoralDistrictRegexp = 'state(wide)?|u\.?s\.? senate|u\.?s\.? (rep(resentative)?|house)|congressional|([a-tv-z][a-tv-z]|ut|state) senate|([a-tv-z][a-rt-z]|ut|state) (rep(resentative)?|house( of delegates)?)|house of delegates|house|county(wide)?|county offices|mayor|municipality|county commission(?:er)?|ward|school|school district|school member district|local school board|prosecutorial district|superior court|town(ship)?|sanitary';

var typeErrorDescriptions = {
  'contests': 'Contest type must be one of the following: "general", "primary", "run-off", "referendum", or "judge retention"',
  'elections': 'Election type must be one of the following: "Federal", "State", "County", "City", or "Town"',
  'electoral-districts': 'Electoral Districts type must match the following regular expression: ' + electoralDistrictRegexp,
  'localities': 'Locality type must be one of the following: "county", "city", "town", "township", "borough", "parish", "village", or "region"'
};

angular.module('vipFilters', []).
  filter('severity', translator(severities)).
  filter('errorTitle', function() {
    return function(error) {
      return errorTitles[error.error_type] || error.error_type;
    }
  }).
  filter('errorDescription', function() {
    return function(error) {
      if (error.error_type == 'type') {
        return typeErrorDescriptions[error.scope] || 'Type is incorrect. Please check specification for the correct inputs.';
      } else {
        return errorDescriptions[error.error_type] || error.error_type;
      }
    }
  }).
  filter('errorScope', translator(errorScope)).
  filter('errorExample', function () {
    return function(error) {
      var identifier = error.identifier;
      if (error.identifier == -1) {
        identifier = 'global';
      }
      return "id = " + identifier + " (" + error.error_data + ")";
    }}).
  filter('xmlTreeErrorExample', function () {
    return function(error) {
      return error.error_data + "\n" +
             "id = " + error.identifier + "\n" +
             "path = " + error.path;
    }}).
  filter('errorCompletion', function () {
    return function(overview) {
      if (!overview.errors || !overview.info) { return 100; }

      var errors = overview.errors.count;
      if (errors == 0) { return 100; };

      var complete = overview.info.count - errors;
      return Math.round(complete / overview.info.count * 100);
    }
  }).
  filter('addComma', function() {
    return function(text) {
      return (text === null || text === "") ? '' : text + ', ';
    }
  });
