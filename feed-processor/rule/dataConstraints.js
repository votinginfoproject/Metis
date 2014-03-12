
var models = require('../../config').mongoose.model;

var theseConstraints = {

  /*
   define constraints using the following format:
   [ rule-name: { collection : [ <collection_name>..n ], fields : [ <field-name>..n ] } ]
   */

  /* Unique Ids */
  uniqueIdCheck : [
    {
      entity: [ 'ballots', 'ballotLineResults', 'ballotResponses', 'candidates', 'contests', 'contestResults',
        'customBallots', 'earlyVoteSites', 'elections', 'electionAdministrations', 'electionOfficials',
        'electoralDistricts','localitys','pollingLocations','precincts', 'precinctSplits', 'referendums',
        'sources', 'states', 'streetSegments' ],
      fields: [ 'elementId' ]
    }
  ],

  /* Unique Street Segments */
  streetSegmentOverlap : [
    {
      entity: [models.streetSegment], fields: []
    }
  ],

  /*  Valid Url  */
  validUrl : [
    {
      entity: [models.ballot], fields: ['imageUrl']
    } ,
    {
      entity: [models.candidate], fields: ['candidateUrl', 'photoUrl']
    },
    {
      entity: [models.election], fields: ['resultsUrl']
    },
    {
      entity: [models.electionAdministration], fields: [ 'electionsUrl','registrationUrl', 'amIRegisteredUrl',
                                                         'absenteeUrl', 'whereDoIVoteUrl', 'whatIsOnMyBallotUrl',
                                                         'rulesUrl' ]
    },
    {
      entity: [models.pollingLocation], fields: ['photoUrl']
    },
    {
      entity: [models.precinct], fields: ['ballotStyleImageUrl']
    },
    {
      entity: [models.precinctSplit], fields: ['ballotStyleImageUrl']
    },
    {
      entity: [models.source], fields: ['organizationUrl', 'touUrl']
    }
  ],
  direction : [
    {
      entity: [models.streetSegment], fields: ['nonHouseAddress.addressDirection','nonHouseAddress.streetDirection']
    }],
  /* locality type range */
  localityType: [
    {
      entity: [models.locality], fields: ['type']
  }],

  /* email format */
  emailFormat : [
    {
      entity: [models.candidate], fields: ['email']
    },
    {
      entity: [models.electionOfficial], fields: ['email']
    }],

  /* phone number format */
  phoneNumberFormat : [
    {
      entity: [models.candidate], fields: ['phone']
    },
    {
      entity: [models.electionOfficial], fields: ['phone']
    }],

  /* zip code format */
  zipCodeFormat : [
    {
      entity: [models.candidate], fields: ['filedMailingAddress.zip']
    },
    {
      entity: [models.earlyVoteSite], fields: ['address.zip']
    },
    {
      entity: [models.electionAdministration], fields: ['mailingAddress.zip', 'physicalAddress.zip']
    },
    {
      entity: [models.pollingLocation], fields: ['address.zip']
    },
    {
      entity: [models.streetSegment], fields: ['nonHouseAddress.zip']
    }
  ]

};

module.exports = theseConstraints;