var translator = function(translations) {
  return function() {
    return function(input) {
      return translations[input] || input;
    }
  }
};

var severities = { warnings: 'Warning',
                   errors: 'Error',
                   critical: 'Critical',
                   fatal: 'Fatal' };

var errorTitles = { 'image_url': 'Image URL improperly formatted',
                    'duplicate-rows': 'Duplicate records' };

var errorDescriptions = { 'image_url': 'If element:image_url exists, it must contain valid website that begins with:http(s)://',
                          'duplicate-rows': 'Duplicate records' };

angular.module('vipFilters', []).
  filter('severity', translator(severities)).
  filter('errorTitle', translator(errorTitles)).
  filter('errorDescription', translator(errorDescriptions)).
  filter('errorExample', function () {
    return function(error) {
      var identifier = error.identifier;
      if (error.identifier == -1) {
        identifier = 'global';
      }
      return "id = " + identifier + " (" + error.error_data + ")";
    }});
