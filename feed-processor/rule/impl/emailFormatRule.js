/**
 * Created by nboseman on 2/12/14.
 */

var matcher = new RegExp(/[a-zA-Z0-9+_\-\.]+@[0-9a-zA-Z][.-0-9a-zA-Z]*\.[a-zA-Z]/);

var evaluateValidEmail = function(emailAddress, dataSet, entity, constraintSet, ruleDef, callback){

  var isViolated = false;
  if(emailAddress !== null && emailAddress !== ""){
    isViolated = !matcher.test(emailAddress.trim().toLowerCase());
  }

  callback( { isViolated: isViolated, dataItem: constraintSet.fields + " = " + emailAddress, dataSet: dataSet, entity: entity, ruleDef: ruleDef } );
}
exports.evaluate = evaluateValidEmail;