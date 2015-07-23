var translator = function(translations) {
  return function() {
    return function(input) {
      return translations[input] || input;
    }
  }
};

var severities = { warnings: 'Warning',
                   errors: 'Error',
                   critical: 'Critical',
                   fatal: 'Fatal' };

var errorScope = { "ballots": "Ballots",
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
                   'xml-generation': 'XML Generation' };

var errorHeadings = [ 'absentee_ballot_info', 'absentee_url', 'accepted_provisional_votes', 
                      'absentee_request_deadline', 'address_city', 'address_line1', 'address_state', 
                      'am_i_registered_url', 'ballot_id', 'ballot_placement', 'ballot_response_id', 
                      'ballot_style_image_url', 'blank_votes', 'candidate_id', 'candidate_url', 
                      'contest_id', 'custom_ballot_id', 'date', 'datetime', 'early_vote_site_id', 
                      'election_administration_id', 'election_day_registration', 'election_id', 
                      'elections_url', 'electoral_district_id', 'election_type', 'email', 
                      'end_apartment_number', 'end_date', 'end_house_number', 'eo_id', 
                      'entire_district', 'fax', 'feed_contact_id', 'filing_closed_date', 'heading', 
                      'id', 'image_url', 'jurisdiction_id', 'locality_id', 'mail_only', 'name', 
                      'non_house_address_address_direction', 'non_house_address_house_number', 
                      'non_house_address_street_direction', 'number', 'number_elected', 
                      'number_voting_for', 'odd_even_both', 'organization_url', 'ovc_id', 'overvotes', 
                      'partisan', 'phone', 'photo_url', 'polling_location_id', 'precinct_id', 
                      'precinct_split_id', 'referendum_id', 'registration_deadline', 'registration_info', 
                      'registration_url', 'rejected_votes', 'results_url', 'rules_url', 'sort_order', 
                      'special', 'start_apartment_number', 'start_date', 'start_house_number', 'state_id', 
                      'statewide', 'text', 'title', 'total_votes', 'total_valid_votes', 'tou_url', 'type', 
                      'vip_id', 'victorious', 'votes', 'what_is_on_my_ballot_url', 'where_do_i_vote_url', 
                      'write_in' ];

var errorTitles = { 'bad-filenames': 'CSV files named incorrectly',
                    'duplicate-ids': 'Duplicate IDs',
                    'duplicate-rows': 'Duplicate records',
                    'extraneous-headers': 'Extraneous headers',
                    'incomplete-mailing-address': 'Incomplete mailing address',
                    'incomplete-physical-address': 'Incomplete physical address',
                    'invalid-vip-id': 'invalid VIP ID',
                    'missing-csv': 'Missing CSV',
                    'missing-dependency': 'Missing dependency',
                    'missing-headers': 'Missing headers',
                    'number-of-values': 'Unexpected number of values',
                    'overlaps': 'Overlapping street segments',
                    'row-constraint': 'Row constraint',
                    'unknown-tag': 'Unknown tag',
                    'unmatched-reference': 'Unmatched reference',
                    'unreferenced-row': 'Unreferenced row',
                    'invalid-xml': 'Generated XML is invalid'};

var errorDescriptions = { 'absentee_ballot_info': 'Url must conform to the format: http[?s]://<domain>.<org>',
                          'absentee_url': 'Url must conform to the format: http[?s]://<domain>.<org>',
                          'accepted_provisional_votes': 'Must be all digits',
                          'absentee_request_deadline': 'Date must conform to the format YYYY-MM-DDTHH:MM:SS (e.g. 2012-04-29T18:06:46)',
                          'address_city': 'header:address_city must exist',
                          'address_line1': 'header:address_line1 must exist',
                          'address_state': 'header:address_state must exist',
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
                          'duplicate-rows': 'No duplicate records within file',
                          'extraneous-headers': 'Extra headers included in a .txt file',
                          'incomplete-mailing-address': 'Election administration addresses must be complete',
                          'incomplete-physical-address': 'Election administration addresses must be complete',
                          'invalid-vip-id': 'Source file must contain valid FIPS for vip_id',
                          'invalid-xml': 'The XML generated from processing the feed is invalid',
                          'missing-csv': 'An essential CSV file is missing',
                          'missing-dependency': 'CSV files have additional, dependent files which have not been provided',
                          'missing-headers': 'Required headers missing from a .txt file',
                          'number-of-values': 'Number of columns and number of values do not match',
                          'overlaps': 'Street segments must not overlap',
                          'row-constraint': 'Specified files must only contain one record: source, election, state',
                          'unknown-tag': 'Unknown tags included in XML file',
                          'unmatched-reference': 'Element references another element that does not appear in this data set',
                          'unreferenced-row': 'Element should be referred to by another element but is not referenced anywhere in this data set' };

angular.module('vipFilters', []).
  filter('severity', translator(severities)).
  filter('errorTitle', function() {
    return function(error) {
      if (errorHeadings.indexOf(error.error_type) != -1) {
        return error.error_data.slice(1,-1);
      } else {
        return errorTitles[error.error_type] || error.error_type;
      }
    }
  }).
  filter('errorDescription', function() {
    return function(error) {
      if (error.error_type == 'type') {
        switch (error.scope) {
          case 'contests':
            return 'Contest type must be one of the following: "general", "primary", "run-off", "referendum", or "judge retention"';
          case 'elections':
            return 'Election type must be one of the following: "Federal", "State", "County", "City", or "Town"';
          case 'electoral-districts':
            return 'Electoral Districts type must be one of the following: "statewide", "state senate", "state house", "fire district", "congressional district", "school district", or "county"';
          case 'localities':
            return 'Locality type must be one of the following: "county", "city", "town", "township", "borough", "parish", "village", or "region"';
          default:
            return 'Type is incorrect. Please check specification for the correct inputs.';
        }
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
  filter('errorCompletion', function () {
    return function(overview) {
      if (!overview.errors || !overview.info) { return 100; }

      var errors = overview.errors.count;
      if (errors == 0) { return 100; };

      var complete = overview.info.count - errors;
      return Math.round(complete / overview.info.count * 100);
    }
  });
