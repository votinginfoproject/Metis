
var models = require('../../config').mongoose.model;

var theseConstraints = {

  /*
   define constraints using the following format:
   [ rule-name: { collection : [ <collection_name>..n ], fields : [ <field-name>..n ] } ]
   */

  /* Unique Ids */
  uniqueIdCheck : [
    {
      entity: [ ],
      fields: [ ]
    }
  ],

  /* Unique Street Segments */
  streetSegmentOverlap : [
    {
      // leaving fields blank as we will need to query against several fields within street segments
      // and this will also change the behavior of dataFetcher.js formatSearchResultFields()
      entity: [models.streetsegment], fields: []
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
      entity: [models.election], fields: ['resultsUrl', 'registrationInfo', 'absenteeBallotInfo']
    },
    {
      entity: [models.electionadministration], fields: [ 'electionsUrl','registrationUrl', 'amIRegisteredUrl',
                                                         'absenteeUrl', 'whereDoIVoteUrl', 'whatIsOnMyBallotUrl',
                                                         'rulesUrl' ]
    },
    {
      entity: [models.pollinglocation], fields: ['photoUrl']
    },
    {
      entity: [models.precinct], fields: ['ballotStyleImageUrl']
    },
    {
      entity: [models.precinctsplit], fields: ['ballotStyleImageUrl']
    },
    {
      entity: [models.source], fields: ['organizationUrl', 'touUrl']
    }
  ],
  /* house or street direction */
  // implementation will work with one entity currently
  direction : [
    {
      entity: [models.streetsegment], fields: ['nonHouseAddress.addressDirection','nonHouseAddress.streetDirection']
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
      entity: [models.electionofficial], fields: ['email']
    },
    {
      entity: [models.electionadministration], fields: ['email']
    }],

  /* phone number format */
  phoneNumberFormat : [
    {
      entity: [models.candidate], fields: ['phone']
    },
    {
      entity: [models.electionofficial], fields: ['phone']
    }],

  /* zip code format */
  zipCodeFormat : [
    {
      entity: [models.candidate], fields: ['filedMailingAddress.zip']
    },
    {
      entity: [models.earlyvotesite], fields: ['address.zip']
    },
    {
      entity: [models.electionadministration], fields: ['mailingAddress.zip', 'physicalAddress.zip']
    },
    {
      entity: [models.pollinglocation], fields: ['address.zip']
    },
    {
      entity: [models.streetsegment], fields: ['nonHouseAddress.zip', 'zip']
    }
  ],

  /* house and apt number  */
  // implementation will work with one entity currently
  houseAptNumber : [
    {
      entity: [models.streetsegment], fields: ['startHouseNumber', 'endHouseNumber', 'startApartmentNumber', 'endApartmentNumber']
    }
  ],

  orphanedEVS : [ { entity: [ models.earlyvotesite ], fields: [] } ],

  missingPollingLocation: [ { entity: [ models.precinctsplit ], fields: [ '_pollingLocations' ] } ],

  nonExistentAdmin: [ { entity: [ models.localitys, models.states ], fields: [] } ]

};

module.exports = theseConstraints;