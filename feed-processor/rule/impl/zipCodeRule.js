/**
 * Created by nboseman on 2/12/14.
 */

var when = require('when');

var evaluateValidZipCode = function(zipCode, dataSet, entity, constraintSet, ruleDef){
  var isViolated = false;
  if((zipCode == null || zipCode.trim() == "")){
    isViolated = false;
  }
  else {
    matcher = new RegExp(/\d{5}(?:[-\s]\d{4})?/);
    isViolated = !matcher.test(zipCode.trim());
  }
  return when.resolve({isViolated: isViolated, dataItem: "valid value: zip = " + zipCode, dataSet: dataSet, entity: entity, ruleDef: ruleDef});
}
exports.evaluate = evaluateValidZipCode;

