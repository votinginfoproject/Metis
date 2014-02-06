
/*
 define rule using the below format:
 { name : '<rule_name>', condition : <rule_evaluation_function>, description: <rule_description> }
 */

var metisRuleList = [

  {
    title: 'validUrl',
    errorCode: 1,
    severityCode: 0,
    severityText: 'Metis url elements cannot be malformed',
    implementation: './impl/validUrlRule'
  },
  {
    title: 'uniqueStreetSegment',
    errorCode: 2,
    severityCode: 0,
    severityText: 'Street Segments must be valid and cannot have overlap',
    implementation: './impl/streetSegmentRule'
  },
  {
    title: 'uniqueIdCheck',
    errorCode: 3,
    severityCode: 1,
    severityText: 'All top-level metis elements must have a unique ID value',
    implementation: './impl/uniqueIdRule'
  }
];

module.exports = metisRuleList;
