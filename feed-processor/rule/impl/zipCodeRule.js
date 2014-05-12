/**
 * Created by nboseman on 2/12/14.
 */

var evaluateValidZipCode = function(zipCode, dataSet, entity, constraintSet, ruleDef, callback){
  var isViolated = false;
  if(zipCode) {
    var trimmedZip = zipCode.trim();
    if (trimmedZip !== "") {
      var matcher = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
      isViolated = !matcher.test(trimmedZip);

      if(trimmedZip == '00000' || trimmedZip == '00000-0000') {
        isViolated = true;
      }
    }
   }
  callback( { isViolated: isViolated, dataItem: constraintSet + " = " + zipCode, dataSet: dataSet, entity: entity, ruleDef: ruleDef } );
};
exports.evaluate = evaluateValidZipCode;

