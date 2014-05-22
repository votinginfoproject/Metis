
/*
 define rule using the below format:
 { name : '<rule_name>', condition : <rule_evaluation_function>, description: <rule_description> }
 */

var constraints = require('./dataConstraints');

var metisRuleList = [

  /* valid url format */
  {
    ruleId: 'validUrl',
    title: 'Invalid Url Format',
    type: 'objectLevelRule',
    isFeedLevelRule: false,
    isActive: true,
    errorCode: 1,
    errorText: 'Url must conform to the format: http[?s]://<domain>.<org>',
    severityCode: 2,
    severityText: 'Warning',
    implementation: './impl/validUrlRule',
    dataConstraints: constraints['validUrl']
  },
  /* locality type range */
  {
    ruleId: 'localityTypes',
    title: 'Invalid Locality Type',
    type: 'objectLevelRule',
    isFeedLevelRule: false,
    isActive: true,
    errorCode: 2,
    errorText: "Valid Locality types: county, city, town, township, borough, parish, village, region",
    severityCode: 1,
    severityText: 'Error',
    implementation: './impl/localityTypeRule',
    dataConstraints: constraints['localityType']
  },
  {
    ruleId: 'uniqueIdCheck',
    title: 'Duplicate IDs',
    type: 'feedLevelRule',
    isFeedLevelRule: false,
    isActive: true,
    errorCode: 3,
    errorText: 'Top-level Metis element IDs must be unique',
    severityCode: 1,
    severityText: 'Error',
    implementation: './impl/uniqueIdRule',
    dataConstraints: constraints['uniqueIdCheck']
  },
  {
    ruleId: 'streetSegmentOverlap',
    title: 'Street Segment Overlap',
    type: 'feedLevelRule',
    isFeedLevelRule: true,
    isActive: true,
    errorCode: 4,
    errorText: 'Street Segment ranges cannot overlap',
    severityCode: 1,
    severityText: 'Error',
    implementation: './impl/streetSegmentRule',
    dataConstraints: constraints['streetSegmentOverlap']
  },
  /* valid direction range */
  {
    ruleId: 'validDirections',
    title: 'Invalid Direction',
    type: 'feedLevelRule',
    isFeedLevelRule: true,
    isActive: true,
    errorCode: 5,
    errorText: "Valid directions are: N, S, E, W, NW, NE, SW, SE, NORTH, SOUTH, EAST, WEST, NORTHEAST, NORTHWEST, SOUTHEAST, SOUTHWEST",
    severityCode: 2,
    severityText: 'Warning',
    implementation: './impl/directionRule',
    dataConstraints: constraints['direction']
  },
  /* email format */
  {
    ruleId: 'emailFormatRule',
    title: 'Invalid Email Address',
    type: 'objectLevelRule',
    isFeedLevelRule: false,
    isActive: true,
    errorCode: 7,
    errorText: 'Invalid email address format provided. Expected <username>@<domain>.',
    severityCode: 2,
    severityText: 'Warning',
    implementation: './impl/emailFormatRule',
    dataConstraints: constraints['emailFormat']
  },
  /* phone number format */
  {
    ruleId: 'phoneNumberRule',
    title: 'Invalid Phone Number',
    type: 'objectLevelRule',
    isFeedLevelRule: false,
    isActive: true,
    errorCode: 8,
    errorText: 'Invalid phone number provided. Expected format / d[2-9]dd-ddd-ddd / i.e.- 864-478-5239',
    severityCode: 2,
    severityText: 'Warning',
    implementation: './impl/phoneNumberRule',
    dataConstraints: constraints['phoneNumberFormat']
  },
  /* zip code format */
  {
    ruleId: 'zipCodeRule',
    title: 'Invalid Zip Code',
    type: 'objectLevelRule',
    isFeedLevelRule: false,
    isActive: true,
    errorCode: 9,
    errorText: 'Invalid zip code format provided.  Expected format / ddddd-dddd / i.e.- 95239-7839 or 91210',
    severityCode: 2,
    severityText: 'Warning',
    implementation: './impl/zipCodeRule',
    dataConstraints: constraints['zipCodeFormat']
  },
  /* house and apartment number check */
  {
    ruleId: 'houseAptRule',
    title: 'Invalid House or Apt Number',
    type: 'feedLevelRule',
    isFeedLevelRule: false,
    isActive: true,
    errorCode: 10,
    errorText: 'Invalid House or Apt number provided.  Number must be greater than 0',
    severityCode: 2,
    severityText: 'Warning',
    implementation: './impl/houseAptRule',
    dataConstraints: constraints['houseAptNumber']
  },
  {
    ruleId: 'orphanedEntityRule',
    title: 'Orphaned Entity',
    type: 'feedLevelRule',
    isFeedLevelRule: false,
    isActive: true,
    errorCode: 11,
    errorText: 'Early Vote Site is not referenced in any Precinct, Precinct Split, or Locality',
    severityCode: 1,
    severityText: 'Error',
    implementation: './impl/orphanedEntityRule',
    dataConstraints: constraints['orphanedEntity']
  },
  {
    ruleId: 'missingPollingLocationRule',
    title: 'Precinct Split Missing Polling Location',
    type: 'objectLevelRule',
    isFeedLevelRule: false,
    isActive: true,
    errorCode: 12,
    errorText: 'Precinct Split has no Polling Location associated with it',
    severityCode: 1,
    severityText: 'Error',
    implementation: './impl/missingPollingLocationRule',
    dataConstraints: constraints['missingPollingLocation']
  },
  {
    ruleId: 'nonExistentLinkRule',
    title: 'Linking to a nonexistent ID',
    type: 'feedLevelRule',
    isFeedLevelRule: false,
    isActive: true,
    errorCode: 14,
    errorText: '',
    severityCode: 2,
    severityText: 'warning',
    implementation: './impl/nonExistentLinkRule',
    dataConstraints: constraints['nonExistentLink']
  }
  /* address direction range */
];

module.exports = metisRuleList;
