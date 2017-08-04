'use strict';

vipApp.factory('$configService', function ($http, $sce) {
  return {
    getResponse: function(options, callback) {
      $http.get(options['path'], options['config']).
        success(function (results, status) {
	  if (callback) {
            callback(results);
          }
        });
    }
  }
});
