/**
 * Created by nboseman on 12/28/13.
 */

//data element descriptor for use by RulesEngine to enable configurable data constraints

var ruleConstraints = {
  validUrl : {
    ballot : ["image_url"],
    candidate : ["candidate_url", "photo_url"],
    election : ["results_url"],
    electionAdministration :[
      "elections_url",
      "registration_url",
      "am_i_registered_url",
      "absentee_url",
      "where_do_i_vote_url",
      "what_is_on_my_ballot_url",
      "rules_url"
    ],
    pollingLocation : ["photo_url"],
    precinct : ["ballot_style_image_url"],
    precinctSplit : ["ballot_style_image_url"],
    source : ["organization_url"]
  },
  //uniqueId
  uniqueIDCheck : {
    topLevelElements: require('config').mongoose.model.all
  }
};


exports.ruleConstraints = ruleConstraints;
