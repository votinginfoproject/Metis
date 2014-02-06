
var models = require('../../config').mongoose.model;

var theseConstraints = {
  validUrl : [
    { entity: [models.ballot], fields: ["imageUrl"] } ,
    { entity: [models.candidate], fields: ["candidateUrl", "photoUrl"] },
    { entity: [models.election], fields: ["resultsUrl"] },
    { entity: [models.electionAdministration],
        fields: [ "electionsUrl","registrationUrl", "amIRegisteredUrl", "absenteeUrl", "whereDoIVoteUrl",
                  "whatIsOnMyBallotUrl", "rulesUrl" ]},
    { entity: [models.pollingLocation], fields: ["photoUrl"] },
    { entity: [models.precinct], fields: ["ballotStyleImageUrl"] },
    { entity: [models.precinctSplit], fields: ["ballotStyleImageUrl"]},
    { entity: [models.source], fields: ["organizationUrl"] }
  ],
  //TODO: replace entity list with config list from models
  uniqueIdCheck : [
    { entity: [ "ballots", "candidates", "contests", "elections", "electionAdministrations", "electionOfficials",
                "electoralDistricts","localitys","pollingLocations","precincts", "precinctSplits", "sources", "states" ],
      fields: [ "elementId" ]
    }
  ],
  uniqueStreetSegment : [
    { entity: [models.streetSegment], fields: []}
  ]
};

module.exports = theseConstraints;