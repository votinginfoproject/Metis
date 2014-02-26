
/*
 define rule using the below format:
 { name : '<rule_name>', condition : <rule_evaluation_function>, description: <rule_description> }
 */

var constraints = require('./dataconstraints');

var metisRuleList = [

  {
    title: 'validUrl',
    type: 'objectLevelRule',
    isFeedLevelRule: false,
    isActive: true,
    errorCode: 1,
    errorText: 'Invalid Url format cannot be malformed',
    severityCode: 2,
    severityText: 'Warning',
    implementation: './impl/validUrlRule',
    dataConstraints: constraints['validUrl']
  },
  {
    title: 'localityTypes',
    type: 'objectLevelRule',
    isFeedLevelRule: false,
    isActive: true,
    errorCode: 2,
    errorText: 'Invalid Locality Type',
    severityCode: 1,
    severityText: 'Error',
    implementation: './impl/localitytyperule',
    dataConstraints: constraints['localityType']
  },
  {
    title: 'uniqueIdCheck',
    type: 'feedLevelRule',
    isFeedLevelRule: false,
    isActive: true,
    errorCode: 3,
    errorText: 'All top-level metis elements must have a unique ID value',
    severityCode: 1,
    severityText: 'Error',
    implementation: './impl/uniqueIdRule',
    dataConstraints: constraints['uniqueIdCheck']
  },
  {
    title: 'uniqueStreetSegment',
    type: 'objectLevelRule',
    isFeedLevelRule: false,
    isActive: false,
    errorCode: 4,
    errorText: 'Street Segments must be valid and cannot have overlap',
    severityCode: 1,
    severityText: 'Error',
    implementation: './impl/streetSegmentRule',
    dataConstraints: constraints['uniqueStreetSegment']
  },
  /* address direction range */
  {
    title: 'addressDirectionRule',
    type: 'feedLevelRule',
    isFeedLevelRule: true,
    isActive: false,
    errorCode: 5,
    errorText: 'Address Direction value does not fall within the predefined set of recognized value types or formats',
    severityCode: 2,
    severityText: 'Warning',
    implementation: './impl/addressDirectionRule',
    dataConstraints: constraints['addressDirection']
  },
  /* email format */
  {
    title: 'emailFormatRule',
    type: 'objectLevelRule',
    isFeedLevelRule: false,
    isActive: true,
    errorCode: 6,
    errorText: 'Invalid email address format provided',
    severityCode: 2,
    severityText: 'Warning',
    implementation: './impl/emailFormatRule',
    dataConstraints: constraints['emailFormat']
  },
  /* phone number format */
  {
    title: 'phoneNumberRule',
    type: 'objectLevelRule',
    isFeedLevelRule: false,
    isActive: true,
    errorCode: 7,
    errorText: 'Invalid phone number provided',
    severityCode: 2,
    severityText: 'Warning',
    implementation: './impl/phoneNumberRule',
    dataConstraints: constraints['phoneNumberFormat']
  },
  /* address direction range */
  /* valid url format */
  /* zip code format */
  {
    title: 'zipCodeRule',
    type: 'objectLevelRule',
    isFeedLevelRule: false,
    isActive: true,
    errorCode: 8,
    errorText: 'Invalid zip code format provided',
    severityCode: 2,
    severityText: 'Warning',
    implementation: './impl/zipCodeRule',
    dataConstraints: constraints['zipCodeFormat']
  }
  /* locality type range */


];

module.exports = metisRuleList;
