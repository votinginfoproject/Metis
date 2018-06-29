'use strict';

vipApp.factory('$feedDataPaths', function ($http) {
  return {
    getResponse: function(options, callback) {
      $http.get(options['path'], options['config']).
        then(function onSuccess(response) {
          var results = response.data;
          options['scope'][options['key']] = results;
          if (callback) {
            callback(results);
          }
        }, function onError(response) {
          options['scope'][options['key']] = null;
          options['pageHeader'] = options['pageHeader'] || {};
          options['pageHeader']['error'] = options['pageHeader']['error'] || '';
          options['pageHeader']['error'] += options['errorMessage'];
        });
    }
  }
});
