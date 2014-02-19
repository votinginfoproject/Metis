/**
 * Created by nboseman on 2/12/14.
 */

var when = require('when');

var evaluateAddressDirectionType = function(addressDirectionType, dataSet, entity, constraintSet, ruleDef){

  var isViolated = false;
  var addressDirectionTypesList = ['n','s','e','w','nw','ne','sw','se','north','south','east','west','northeast','northwest','southeast','southwest']

  if((addressDirectionType == null || addressDirectionType == "")){
    isViolated = true;
  }
  else {
    isViolated = (addressDirectionTypesList.indexOf(addressDirectionType) < 0);
  }
  return when.resolve({isViolated: isViolated, dataItem: addressDirectionType, dataSet: dataSet, entity: entity, ruleDef: ruleDef});
}
exports.evaluate = evaluateAddressDirectionType;