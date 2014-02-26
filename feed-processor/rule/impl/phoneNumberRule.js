/**
 * Created by nboseman on 2/12/14.
 */

var when = require('when');
var matcher = new RegExp(/1?\s*\W?\s*([2-9][0-8][0-9])\s*\W?\s*([2-9][0-9]{2})\s*\W?\s*([0-9]{4})(\se?x?t?(\d*))?/);

var evaluatePhoneNumber = function(phoneNumber, dataSet, entity, constraintSet, ruleDef){
  var isViolated = false;

  //TODO: parseInt check for value passed in
  if((phoneNumber == null || phoneNumber == "")){
    isViolated = true;
  }
  else {
    isViolated = !matcher.test(phoneNumber.trim().toLowerCase());
  }
  return when.resolve({isViolated: isViolated, dataItem: constraintSet.fields + " = " + phoneNumber, dataSet: dataSet, entity: entity, ruleDef: ruleDef});
};

exports.evaluate = evaluatePhoneNumber;