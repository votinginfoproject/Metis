/**
 * Created by nboseman on 2/12/14.
 */

var when = require('when');
var localityTypesList = ['county','city','town','township','borough','parish','village','region'];

var evaluateLocalityType = function(localityType, dataSet, entity, constraintSet, ruleDef){

  var isViolated = false;

  if(localityType != null && localityType != ""){
    isViolated = (localityTypesList.indexOf(localityType.trim().toLowerCase()) < 0);
  }
  return when.resolve({isViolated: isViolated, dataItem: constraintSet.fields + " = " + localityType, dataSet: dataSet, entity: entity, ruleDef: ruleDef});
}
exports.evaluate = evaluateLocalityType;