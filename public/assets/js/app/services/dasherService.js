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
      }
    };
});
