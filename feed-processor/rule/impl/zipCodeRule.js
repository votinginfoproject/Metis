/**
 * Created by nboseman on 2/12/14.
 */

var evaluateValidZipCode = function(zipCode, dataSet, entity, constraintSet, ruleDef, callback){


  var isViolated = false;
  if(zipCode !== null && zipCode.trim() !== ""){
    var matcher = new RegExp(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
    isViolated = !matcher.test(zipCode);
  }

  callback( { isViolated: isViolated, dataItem: constraintSet.fields + " = " + zipCode, dataSet: dataSet, entity: entity, ruleDef: ruleDef } );
}
exports.evaluate = evaluateValidZipCode;

