/**
 * Created by nboseman on 2/12/14.
 */

var when = require('when');

var evaluateValidEmail = function(emailAddress, dataSet, entity, constraintSet, ruleDef){

  var isViolated = false;
  if((emailAddress == null || emailAddress == "")){
    isViolated = true;
  }
  else {
    matcher = new RegExp(/[a-zA-Z0-9+_\-\.]+@[0-9a-zA-Z][.-0-9a-zA-Z]*.[a-zA-Z]/);
    isViolated = matcher.test(emailAddress);
  }

  return when.resolve({isViolated: isViolated, dataItem: emailAddress, dataSet: dataSet, entity: entity, ruleDef: ruleDef});
}
exports.evaluate = evaluateValidEmail;