/**
 * Created by nboseman on 2/12/14.
 */

var localityTypesList = ['county','city','town','township','borough','parish','village','region'];

var evaluateLocalityType = function(localityType, dataSet, entity, constraintSet, ruleDef, callback){

  var isViolated = false;

  if(localityType !== null && localityType !== ""){
    isViolated = (localityTypesList.indexOf(localityType.trim().toLowerCase()) < 0);
  }
  callback( { isViolated: isViolated, dataItem: constraintSet + " = " + localityType, dataSet: dataSet, entity: entity, ruleDef: ruleDef } );
}
exports.evaluate = evaluateLocalityType;