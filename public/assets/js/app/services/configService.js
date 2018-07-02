'use strict';

vipApp.factory('$configService', function ($http, $sce) {
  return {
    getResponse: function(options, callback) {
      $http.get(options['path'], options['config']).
        then(function onSuccess(response) {
	  if (callback) {
            callback(response.data);
          }
        })
    }
  }
});
