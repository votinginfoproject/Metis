'use strict';

vipApp.factory('$errorsService', function () {

  // Split fatal and critical from errors and warnings
  var splitErrors = function(scope, errors) {
    scope.fatalErrors = errors.filter(function(error) {
      return error.severity === 'fatal' || error.severity === 'critical';
    });
    scope.minorErrors = errors.filter(function(error) {
      return error.severity === 'warnings' || error.severity === 'errors';
    });
  }

  // Toggle error details on error pages
  var toggleError = function (prefix, index) {
    var obj = jQuery("#" + prefix + "ErrorDetail" + index);
    var arrowClosed = jQuery("#" + prefix + "ErrorArrowClosed" + index);
    var arrowOpen = jQuery("#" + prefix + "ErrorArrowOpen" + index);

    if (obj.is(":visible")) {
      obj.hide();
      arrowClosed.show();
      arrowOpen.hide();
    } else {
      obj.show();
      arrowClosed.hide();
      arrowOpen.show();
    }
  };

  return {
    splitErrors: splitErrors,
    toggleError: toggleError
  };
});
