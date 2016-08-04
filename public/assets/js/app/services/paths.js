'use strict';

vipApp.factory('$feedDataPaths', function ($http) {
  return {
    getResponse: function(options, callback) {
      $http.get(options['path'], options['config']).
        success(function (results, status) {
          options['scope'][options['key']] = results;
          if (callback) {
            callback(results);
          }
        }).
        error(function (results, status) {
          options['scope'][options['key']] = null;
          options['pageHeader'] = options['pageHeader'] || {};
          options['pageHeader']['error'] = options['pageHeader']['error'] || '';
          options['pageHeader']['error'] += options['errorMessage'];
        });
    }
  }
});
