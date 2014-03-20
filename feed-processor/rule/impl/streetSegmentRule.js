var mongoose = require('mongoose');
var when = require('when');
var deferred = when.defer();
var ruleViolation = require('../ruleviolation');
var daoSchemas = require('../../../dao/schemas');

var interval = require('interval-query');

var errorCount = 0;
var constraints;
var feedId;
var rule;

var evaluateStreetSegmentsOverlap = function(_feedId, constraintSet, ruleDefinition){

  rule = ruleDefinition;
  constraints = constraintSet;
  feedId = _feedId;

  Model = mongoose.model(constraintSet.entity[0]);

  var promise = Model.aggregate(
    {
      // group by street segments where the following attributes are the same
      $group: {
        _id: {
          streetDirection: "$nonHouseAddress.streetDirection",
          streetSuffix: "$nonHouseAddress.streetSuffix",
          addressDirection: "$nonHouseAddress.addressDirection",
          streetName: "$nonHouseAddress.streetName",
          city: "$nonHouseAddress.city",
          zip: "$nonHouseAddress.zip"
        },
        // and get a count for each group
        count: { $sum: 1 },
        // and the rest of the attributes that we will need to operate on later
        elementId: { $push: "$elementId" },
        id: { $push: "$_id" },
        startHouseNumber: { $push: "$startHouseNumber" },
        endHouseNumber: { $push: "$endHouseNumber" },
        oddEvenBoth: { $push: "$oddEvenBoth" }
      }
    },
    {
      // match only street segments that have the possibility of overlapping
      // these are the streetsegments where the address components match but
      // we have not yet checked the actual streetnumbers for overlapp
      // and there is more than 1 of these street segments
      $match : {count : { $gt : 1 } }
    }
  ).exec();

  promise.then(function(results){

    // loop through the results from the aggregate
    for(var i=0; i<results.length; i++){

      // tree interval creation
      var tree = new interval.SegmentTree;
      tree.clearIntervalStack();

      // due to the way the tree interval provides feedback, we will need to keep track of our data based
      // on which index in the array we are operating on
      var startHouseNumbers = results[i].startHouseNumber;
      var endHouseNumbers = results[i].endHouseNumber;
      var elementIds = results[i].elementId;
      var oebs = results[i].oddEvenBoth;
      var ids = results[i].id;
      var errorTexts = [];

      // build up the tree and store up the potential error text we can have for each interval
      for(var j=0; j< startHouseNumbers.length; j++){
        errorTexts.push("{" + "id: " + elementIds[j] + ", startHouseNumber: " + startHouseNumbers[j] + ", endHouseNumber: " + endHouseNumbers[j] + "}");

        tree.pushInterval(startHouseNumbers[j], endHouseNumbers[j]);
      }

      // build the tree
      tree.buildTree();
      //query to see if there are any overlaps returned
      var treeResults = tree.queryOverlap();

      // go through the tree overlap results
      for(var j=0; j< treeResults.length; j++){
        if(treeResults[j].overlap.length>0){

          var errors = "";
          // if we have overlaps
          for(var k=0; k<treeResults[j].overlap.length; k++){
            var treeOverlap = treeResults[j];
            var index = treeOverlap.overlap[k];
            index = parseInt(index);

            // turn the 1 based index of the treeInterval into a 0 based index of a js array
            index--;

            // now check OddEvenBoth attribute for the segments
            // if the oeb are the same or either one is 'both'
            if(oebs[j] === oebs[index] || oebs[j]==="both" || oebs[index]==="both"){
              errors+= errorTexts[index];
            }
          }

          // now create the overlap error
          if(errors.length>0){
            createError(results[i], elementIds[j], ids[j], errors);
          }

        }
      }

    }

    deferred.resolve({ promisedErrorCount: errorCount });
  });
  promise.onerror = function(){
    deferred.reject(new Error("Issues During Fetch"));
  };

  return deferred.promise;

}
function createError(streetsegment, elementId, mongoId, error) {
  errorCount++;
  ruleErrors = new ruleViolation(constraints.entity[0], elementId, mongoId, feedId, error, error, rule);
  return ruleErrors.model().save();
}

exports.evaluate = evaluateStreetSegmentsOverlap;


/*
PREVIOUS IMPLEMENTATION - CAN USE TO CONFIRM NEW IMPLEMENTATION IS CORRECT
 */

/*
var mongoose = require('mongoose');
var async = require('async');
var when = require('when');

var Violation = require('../ruleviolation');

var evaluateStreetSegmentsOverlap = function(streetSegment, dataSet, entity, constraintSet, ruleDef){
  var Model = mongoose.model(entity);
  var isViolated = false;
  var deferred = when.defer();

  // create the oddEvenBoth query outside based on a conditional

  // basically check to see if the other segment has a "both" value or is equal to the current segment
  // and also if the current segment is "both" then have an empty query so that it's not a limiter.
  // (we can't check the value of the current segment only the values of the segments we are retrieving)
  // This will also allow the other segment to be blank and our current segment to have a value of "both"
  var oddEvenBothQuery = [{'oddEvenBoth': 'both'},{'oddEvenBoth': streetSegment.oddEvenBoth}];
  if(streetSegment.oddEvenBoth == 'both'){
    oddEvenBothQuery = [{}];
  }

  promise = Model
    .find(
    {
      // find all street segments in this feed
      _feed:streetSegment._feed,
      $and: [
        // where the startHouseNumber is between the start and end house number of the other segment or the
        // endHouseNumber is between the start and end house number of the other segment and
        {$or: [
          { $and: [{ 'startHouseNumber': { $gte: streetSegment.startHouseNumber }}, { 'startHouseNumber': { $lte: streetSegment.endHouseNumber }}] },
          { $and: [{ 'endHouseNumber': { $gte: streetSegment.startHouseNumber }}, { 'endHouseNumber': { $lte: streetSegment.endHouseNumber }}] },
          { $and: [{ 'startHouseNumber': { $lte: streetSegment.startHouseNumber }}, { 'endHouseNumber': { $gte: streetSegment.endHouseNumber }}] }
        ]},
        // where oddEvenBoth is the same or either one is 'both'
        { $or: oddEvenBothQuery }
      ]
    })
    .where('elementId').ne(streetSegment.elementId) // that is not the current street segment segment
    .where('nonHouseAddress.streetDirection').equals(streetSegment.nonHouseAddress.streetDirection) // where streetDirection is the same
    .where('nonHouseAddress.streetSuffix').equals(streetSegment.nonHouseAddress.streetSuffix) // where streetSuffix is the same
    .where('nonHouseAddress.addressDirection').equals(streetSegment.nonHouseAddress.addressDirection) // where addressDirection is the same
    .where('nonHouseAddress.streetName').equals(streetSegment.nonHouseAddress.streetName) // where streetName is the same
    .where('nonHouseAddress.city').equals(streetSegment.nonHouseAddress.city) // where city is the same
    .where('nonHouseAddress.zip').equals(streetSegment.nonHouseAddress.zip) // where zip is the same
    .exec();

  promise.then(function(results){

    isViolated = false;
    var resultObject = streetSegment;
    if(results.length > 0){
      isViolated = true;

      resultObject = "";

      for(var i=0; i<results.length; i++){
        resultObject += "{" + "id: " + results[i].elementId + ", startHouseNumber: " + results[i].startHouseNumber + ", endHouseNumber: " + results[i].endHouseNumber + "}"
      }

    }

    //note: if the rule isn't violated, we can resolve with default values for the entity set as they will be ignored
    deferred.resolve({isViolated: isViolated, dataItem: resultObject, dataSet: dataSet, entity: entity, ruleDef: ruleDef});

  });
  promise.onerror = function(){
    deferred.reject(new Error("Issues During Fetch"));
  };
  return deferred.promise;
}

exports.evaluate = evaluateStreetSegmentsOverlap;
*/