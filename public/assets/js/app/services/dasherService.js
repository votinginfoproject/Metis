'use strict';
/*
 * Dasher Service
 *
 *
 */
vipApp.factory('$dasherService', function ($http, $appProperties) {
    return {
      generateApiKey: function(currentApiKey){
        var data = {'apiKey': currentApiKey};
        $http.post("/dasher/generate-api-key", data);
      },

      elections: function() {
        $http.get("/dasher/elections");
      },

      election: function(id) {
        $http.get("/dasher/elections/" + id);
      },

      earlyVoteSites: function(electionId) {
        $http.get("/dasher/elections/" + electionId + "/early-vote-sites");
      },

      earlyVoteSite: function(id) {
        $http.get("/dasher/early-vote-sites/" + id);
      },
    };
});
