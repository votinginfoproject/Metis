/**
 * Created by nboseman on 2/12/14.
 */

var when = require('when');

var evaluateValidZipCode = function(zipCode, dataSet, entity, constraintSet, ruleDef){
  var isViolated = false;
  if(zipCode != null && zipCode.trim() != ""){
    matcher = new RegExp(/\d{5}(?:[-\s]\d{4})?/);
    isViolated = !matcher.test(zipCode);
  }
  return when.resolve({isViolated: isViolated, dataItem: constraintSet.field + " = " + zipCode, dataSet: dataSet, entity: entity, ruleDef: ruleDef});
}
exports.evaluate = evaluateValidZipCode;

