/**
 * Created by bantonides on 1/23/14.
 */
exports.rules = [
  {
    errorCode: 1,
    title: 'Duplicate Ids',
    severityCode: 1,
    severityText: 'Error',
    description: 'All Ids in a feed must be unique.',
    collections: [
      'Ballot',
      'BallotResponse',
      'BallotLineResult',
      'Candidate',
      'Contest',
      'ContestResult',
      'CustomBallot',
      'EarlyVoteSite',
      'Election',
      'ElectionAdmin',
      'ElectionOfficial',
      'ElectoralDistrict',
      'Locality',
      'PollingLocation',
      'Precinct',
      'PrecinctSplit',
      'Referendum',
      'Source',
      'State',
      'StreetSegment'
    ],
    ruleImplementation: './uniqueIds'
  },
  {
    errorCode: 2,
    title: 'Invalid Locality Type',
    severityCode: 2,
    severityText: 'Warning',
    description: 'The locality type is not in the list of recognized types.',
    collections: [
      { name: 'Locality', field: 'type' }
    ],
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
    ruleImplementation: './localityTypes'
  }

];