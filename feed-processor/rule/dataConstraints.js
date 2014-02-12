



var models = require('../../config').mongoose.model;

var theseConstraints = {

  /*
   define constraints using the following format:
   [ rule-name: { collection : [ <collection_name>..n ], fields : [ <field-name>..n ] } ]
   */

  /* Unique Ids */
  uniqueIdCheck : [
    {
      entity: [ "ballots", "candidates", "contests", "elections", "electionAdministrations", "electionOfficials",
        "electoralDistricts","localitys","pollingLocations","precincts", "precinctSplits", "sources", "states" ],
      fields: [ "elementId" ]
    }
  ],

  /* Unique Street Segments */
  uniqueStreetSegment : [
    {
      entity: [models.streetSegment], fields: []
    }
  ],

  /*  Valid Url  */
  validUrl : [
    {
      entity: [models.ballot], fields: ["imageUrl"]
    } ,
    {
      entity: [models.candidate], fields: ["candidateUrl", "photoUrl"]
    },
    {
      entity: [models.election], fields: ["resultsUrl"]
    },
    {
      entity: [models.electionAdministration], fields: [ "electionsUrl","registrationUrl", "amIRegisteredUrl",
                                                         "absenteeUrl", "whereDoIVoteUrl", "whatIsOnMyBallotUrl",
                                                         "rulesUrl" ]
    },
    {
      entity: [models.pollingLocation], fields: ["photoUrl"]
    },
    {
      entity: [models.precinct], fields: ["ballotStyleImageUrl"]
    },
    {
      entity: [models.precinctSplit], fields: ["ballotStyleImageUrl"]
    },
    {
      entity: [models.source], fields: ["organizationUrl"]
    }
  ],

  localityType: [
    {
      entity: [models.locality], fields: ['type']
    }
  ]

};

module.exports = theseConstraints;