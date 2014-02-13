/**
 * Created by bantonides on 2/12/14.
 */
var when = require('when');

function evalLocalityTypes(localityType, dataSet, entity, constraintSet, ruleDef) {

  var isVio = ruleDef.acceptableValues.indexOf(localityType) == -1;

  return when.resolve({isViolated: isVio, dataItem: localityType, dataSet: dataSet, entity: entity, ruleDef: ruleDef});
}

exports.evaluate = evalLocalityTypes;