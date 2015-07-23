'use strict';

vipApp.factory('$feedDataPaths', function ($http) {
  return {
    getResponse: function(options, callback) {
      $http.get(options['path']).
        success(function (results, status) {
          options['scope'][options['key']] = results;
          if (callback) {
            callback(results);
          }
        }).
        error(function (results, status) {
          options['scope'][options['key']] = null;
          options['pageHeader']['error'] += options['errorMessage'];
        });
    }
  }
});
