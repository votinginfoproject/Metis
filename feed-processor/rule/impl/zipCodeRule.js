/**
 * Created by nboseman on 2/12/14.
 */

var evaluateValidZipCode = function(zipCode, dataSet, entity, constraintSet, ruleDef, callback){


  var isViolated = false;
  if(zipCode && zipCode.trim() !== ""){
    var matcher = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
    isViolated = !matcher.test(zipCode.trim());
  }

  callback( { isViolated: isViolated, dataItem: constraintSet + " = " + zipCode, dataSet: dataSet, entity: entity, ruleDef: ruleDef } );
}
exports.evaluate = evaluateValidZipCode;

