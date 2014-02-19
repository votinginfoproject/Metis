
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
    severityCode: 0,
    severityText: 'Invalid Url format cannot be malformed',
    implementation: './impl/validUrlRule',
    dataConstraints: constraints['validUrl']
  },
  {
    title: 'localityTypes',
    type: 'objectLevelRule',
    isFeedLevelRule: false,
    isActive: true,
    errorCode: 2,
    severityCode: 0,
    severityText: 'Invalid Locality Type',
    implementation: './impl/localitytyperule',
    dataConstraints: constraints['localityType']
  },
  {
    title: 'uniqueIdCheckToo',
    type: 'feedLevelRule',
    isFeedLevelRule: true,
    isActive: true,
    errorCode: 3,
    severityCode: 1,
    severityText: 'All top-level metis elements must have a unique ID value',
    implementation: './impl/uniqueIdToo',
    dataConstraints: constraints['uniqueIdCheck']
  },
  {
    title: 'uniqueStreetSegment',
    type: 'objectLevelRule',
    isFeedLevelRule: false,
    isActive: false,
    errorCode: 4,
    severityCode: 1,
    severityText: 'Street Segments must be valid and cannot have overlap',
    implementation: './impl/streetSegmentRule',
    dataConstraints: constraints['uniqueStreetSegment']
  },
  {
    title: 'localityTypeRuleToo',
    type: 'feedLevelRule',
    isFeedLevelRule: true,
    isActive: false,
    errorCode: 4,
    severityCode: 2,
    severityText: 'Invalid locality type',
    implementation: './impl/localityTypes',
    acceptableValues: [
      'county',
      'city',
      'town',
      'township',
      'borough',
      'parish',
      'village',
      'region'
    ],
    dataConstraints: constraints['localityType']
  },
  {
    title: 'uniqueIdCheck',
    type: 'objectLevelRule',
    isFeedLevelRule: false,
    isActive: false,
    errorCode: 4,
    severityCode: 1,
    severityText: 'All top-level metis elements must have a unique ID value',
    implementation: './impl/uniqueId',
    dataConstraints: constraints['uniqueIdCheck']
  },

  /* address direction range */
  {
    title: 'addressDirectionRule',
    type: 'addressDirectionRule',
    isFeedLevelRule: false,
    isActive: false,
    errorCode: 5,
    severityCode: 1,
    severityText: 'Address Direction value does not fall within the predefined set of recognized value types or formats',
    implementation: './impl/addressDirectionRule',
    dataConstraints: constraints['addressDirection']
  },
  /* email format */
  {
    title: 'emailFormatRule',
    type: 'emailFormatRule',
    isFeedLevelRule: false,
    errorCode: 6,
    severityCode: 1,
    severityText: 'Invalid email address format provided',
    implementation: './impl/emailFormatRule',
    dataConstraints: constraints['emailFormat']
  },
  /* phone number format */
  {
    title: 'phoneNumberRule',
    type: 'phoneNumberRule',
    isFeedLevelRule: false,
    errorCode: 6,
    severityCode: 1,
    severityText: 'Invalid phone number provided',
    implementation: './impl/phoneNumberRule',
    dataConstraints: constraints['phoneNumberFormat']
  },
  /* address direction range */
  /* valid url format */
  /* zip code format */
  {
    title: 'zipCodeRule',
    type: 'zipCodeRule',
    isFeedLevelRule: false,
    isActive: false,
    errorCode: 6,
    severityCode: 1,
    severityText: 'Invalid zip code format provided',
    implementation: './impl/zipCodeRule',
    dataConstraints: constraints['zipCodeFormat']
  }
  /* locality type range */


];

module.exports = metisRuleList;
