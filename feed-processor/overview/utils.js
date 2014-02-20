/*
 * Counts the properties in a JSON schema or data object.
 * This function is specially tuned to ignore Mongo related properties (any property that begins with an underscore (_),
 * and the "sortOrder" property.
 *
 * @param Obj - the data or schema object whose properties need to be counted. When counting,
 * properties of inner objects, the property that represents the object is not counted and only
 * its own inner properties.
 *
 * @return - The number of total properties in the object
 */
function countProperties(obj){

  var count = 0;

  // use the correct property to represent the object
  var objToUse = null;
  if(obj._doc !== undefined){
    objToUse = obj._doc;
  } else {
    objToUse = obj;
  }

  var properties = Object.keys(objToUse);

  // loop through the object properties
  for(var i=0; i< properties.length; i++){

    var property = properties[i];

    // ignore properties that start with an underscore _ (these are Mongo added properties)
    // and are "sortOrder"
    if(property.charAt(0)!=="_" &&
       property !== "sortOrder" &&
       property !== "ballotResponses" &&
       property !== "candidates"){

      if(typeof objToUse[property] !== "object" || (objToUse[property] instanceof Array)){
        // if not object can count property as one count
        // or if array can count property as one count
        count++;
      } else {
        // found object, call this same function recursively
        count += countProperties(objToUse[property]);
      }

    }
  }

  // if the object doesn't have a length, then it's a single property
  if(properties.length === 0){
    count++;
  }

  return count;
}

function createOverviewObject(amount, fieldCount, schemaFieldCount, errorCount) {
  return {
    amount: amount ? amount : 0,
    fieldCount: fieldCount ? fieldCount : 0,
    schemaFieldCount: schemaFieldCount ? schemaFieldCount : 0,
    errorCount: errorCount ? errorCount : 0
  }
}

function addOverviewObjects(first, second) {
  return {
    amount: first.amount + second.amount,
    fieldCount: first.fieldCount + second.fieldCount,
    schemaFieldCount: first.schemaFieldCount + second.schemaFieldCount,
    errorCount: first.errorCount + second.errorCount
  }
}

function reduceOverviewObject(arr, schemaFieldCount) {
  var initial = createOverviewObject();
  arr.reduce(function(memo, current) {
    memo.amount++;
    memo.fieldCount += countProperties(current);
    memo.schemaFieldCount += schemaFieldCount;
    return memo;
  }, initial);
  return initial;
}

function findOverviewObject(feedId, ids, model, returnTotal) {
  if(ids === 0) {
    model.find({ _feed: feedId }, function(err, results) {
      returnTotal(reduceOverviewObject(results, model.fieldCount));
    });
  }
  else {
    model.find({ _feed: feedId, _id: { $in: ids } }, function(err, results) {
      returnTotal(reduceOverviewObject(results, model.fieldCount));
    });
  }
}

exports.countProperties = countProperties;
exports.createOverviewObject = createOverviewObject;
exports.addOverviewObjects = addOverviewObjects;
exports.reduceOverviewObject = reduceOverviewObject;
exports.findOverviewObject = findOverviewObject;
