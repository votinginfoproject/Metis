var mongoose = require('mongoose');
var ruleViolation = require('../ruleViolation');
var schemas = require('../../../dao/schemas');
var async = require('async');
var config = require('../../../config');

var interval = require('interval-query');

var singleState = require('./streetSegmentSingle');

var errorCount = 0;
var constraints;
var feedId;
var rule;

var evaluateStreetSegmentsOverlap = function(_feedId, constraintSet, ruleDefinition, callback){

  rule = ruleDefinition;
  constraints = constraintSet;

  if(typeof _feedId === "string")
    feedId = mongoose.Types.ObjectId(_feedId);
  else
    feedId = _feedId;

  schemas.models.Feed.findOne( { _id: feedId }, function(err, feed) {

    if(err) {
      console.log(err);
      process.exit(-1);
    }

    if(!feed) {
      console.log("could not find feed");
      process.exit(-1);
    }

    if(config.checkSingleHouseStates(feed.fipsCode))
      singleState.evaluateStreetSegmentsOverlapSingle(feedId, constraintSet, ruleDefinition, callback);
    else
      evaluate(constraintSet, callback);
  });
}

//var evaluate = function(constraintSet, callback) {
//  var totalErrorCount = 0;
//  async.eachSeries(constraintSet.entity, function(model, done) {
//    var stream = mongoose.model(model).find({ _feed: feedId }).stream();
//
//    stream.on('data', function(err, doc) {
//      stream.pause();
//      getStreamed(doc, model, function(errorCount) {
//        totalErrorCount += errorCount;
//        stream.resume();
//      });
//    });
//
//    stream.on('close', function(err) {
//      if(err) {
//        console.log(err);
//
//        schemas.models.Feed.update({_id: feedId}, { feedStatus: 'Error In Street Segment Rule', complete: false, failed: true },
//          function(err, feed) {
//            process.exit(-1);
//          }
//        );
//      }
//
//      done();
//    });
//
//  }, function() { callback({promisedErrorCount: totalErrorCount}); })
//}

//function evaluate(constraintSet, callback) {
//  var Model = mongoose.model(constraintSet.entity[0]);
//
//  Model.aggregate()
//    .match( { _feed: feedId } )
//    .group({
//      _id: {
//        streetDirection: "$nonHouseAddress.streetDirection",
//        streetSuffix: "$nonHouseAddress.streetSuffix",
//        addressDirection: "$nonHouseAddress.addressDirection",
//        streetName: "$nonHouseAddress.streetName",
//        city: "$nonHouseAddress.city",
//        zip: "$nonHouseAddress.zip",
//        oddEvenBoth: "$oddEvenBoth"
//      },
//      // and get a count for each group
//      count: { $sum: 1 },
//      // and the rest of the attributes that we will need to operate on later
//      elementId: { $push: "$elementId" },
//      id: { $push: "$_id" },
//      startHouseNumber: { $push: "$startHouseNumber" },
//      endHouseNumber: { $push: "$endHouseNumber" }
//    })
//    .match({ count : { $gt : 1 } })
//    .exec(function(err, results) {
//
//      if(err) {
//        console.log(err);
//
//        schemas.models.Feed.update({_id: feedId}, { feedStatus: 'Error In Aggregation', complete: false, failed: true },
//          function(err, feed) {
//            // setting the exit code to -1, which we won't check for in the parent process
//            console.log("Exiting processing due to Aggregation error.")
//            process.exit(-1);
//          }
//        );
//
//        return;
//      }
//
//      // loop through the results from the aggregate
//      for(var i = 0; i < results.length; i++) {
//
//        // tree interval creation
//        var tree = new interval.SegmentTree;
//        tree.clearIntervalStack();
//
//        // due to the way the tree interval provides feedback, we will need to keep track of our data based
//        // on which index in the array we are operating on
//        var startHouseNumbers = results[i].startHouseNumber;
//        var endHouseNumbers = results[i].endHouseNumber;
//        var elementIds = results[i].elementId;
////        var oebs = results[i].oddEvenBoth;
//        var ids = results[i].id;
//        var errorTexts = [];
//
//        // build up the tree and store up the potential error text we can have for each interval
//        for(var j = 0; j < startHouseNumbers.length; j++){
//          errorTexts.push("{" + "id: " + elementIds[j] + ", startHouseNumber: " + startHouseNumbers[j] + ", endHouseNumber: " + endHouseNumbers[j] + "}");
//
//          tree.pushInterval(startHouseNumbers[j], endHouseNumbers[j]);
//        }
//
//        // build the tree
//        tree.buildTree();
//        //query to see if there are any overlaps returned
//        var treeResults = tree.queryOverlap();
//
//        // go through the tree overlap results
//        for(var j = 0; j < treeResults.length; j++){
//          if(treeResults[j].overlap.length > 0){
//
//            var errors = "";
//            // if we have overlaps
//            for(var k = 0; k < treeResults[j].overlap.length; k++){
//              var treeOverlap = treeResults[j];
//              var index = treeOverlap.overlap[k];
//              index = parseInt(index);
//
//              // turn the 1 based index of the treeInterval into a 0 based index of a js array
//              index--;
//
//              // now check OddEvenBoth attribute for the segments
//              // if the oeb are the same or either one is 'both'
////              if(oebs[j] === oebs[index] || oebs[j]==="both" || oebs[index]==="both"){
//                errors+= errorTexts[index];
////              }
//            }
//
//            // now create the overlap error
//            if(errors.length > 0){
//              createError(results[i], elementIds[j], ids[j], errors);
//            }
//
//          }
//        }
//
//      }
//
//      callback({ promisedErrorCount: errorCount });
//    });
//}

//var getStreamed = function(streetSegment, model, callback){
//  var Model = mongoose.model(entity);
//  var isViolated = false;
//
//  // create the oddEvenBoth query outside based on a conditional
//
//  // basically check to see if the other segment has a "both" value or is equal to the current segment
//  // and also if the current segment is "both" then have an empty query so that it's not a limiter.
//  // (we can't check the value of the current segment only the values of the segments we are retrieving)
//  // This will also allow the other segment to be blank and our current segment to have a value of "both"
//  var oddEvenBothQuery = [{'oddEvenBoth': 'both'},{'oddEvenBoth': streetSegment.oddEvenBoth}];
//  if(streetSegment.oddEvenBoth == 'both'){
//    oddEvenBothQuery = [{}];
//  }
//
//  Model.find(
//    {
//      // find all street segments in this feed
//      _feed:streetSegment._feed,
//      $and: [
//        // where the startHouseNumber is between the start and end house number of the other segment or the
//        // endHouseNumber is between the start and end house number of the other segment and
//        {$or: [
//          { $and: [{ 'startHouseNumber': { $gte: streetSegment.startHouseNumber }}, { 'startHouseNumber': { $lte: streetSegment.endHouseNumber }}] },
//          { $and: [{ 'endHouseNumber': { $gte: streetSegment.startHouseNumber }}, { 'endHouseNumber': { $lte: streetSegment.endHouseNumber }}] },
//          { $and: [{ 'startHouseNumber': { $lte: streetSegment.startHouseNumber }}, { 'endHouseNumber': { $gte: streetSegment.endHouseNumber }}] }
//        ]},
//        // where oddEvenBoth is the same or either one is 'both'
//        { $or: oddEvenBothQuery }
//      ]
//    }, {})
//    .where('elementId').ne(streetSegment.elementId) // that is not the current street segment segment
//    .where('nonHouseAddress.streetDirection').equals(streetSegment.nonHouseAddress.streetDirection) // where streetDirection is the same
//    .where('nonHouseAddress.streetSuffix').equals(streetSegment.nonHouseAddress.streetSuffix) // where streetSuffix is the same
//    .where('nonHouseAddress.addressDirection').equals(streetSegment.nonHouseAddress.addressDirection) // where addressDirection is the same
//    .where('nonHouseAddress.streetName').equals(streetSegment.nonHouseAddress.streetName) // where streetName is the same
//    .where('nonHouseAddress.city').equals(streetSegment.nonHouseAddress.city) // where city is the same
//    .where('nonHouseAddress.zip').equals(streetSegment.nonHouseAddress.zip) // where zip is the same
//    .exec(function(results){
//
//    isViolated = false;
//    var resultObject = streetSegment;
//
////    if(results.length > 0){
////      isViolated = true;
////
////      resultObject = "";
////
////      for(var i=0; i<results.length; i++){
////        resultObject += "{" + "id: " + results[i].elementId + ", startHouseNumber: " + results[i].startHouseNumber + ", endHouseNumber: " + results[i].endHouseNumber + "}"
////      }
////
////    }
//  });
//}

//function evaluate(constraintSet, callback) {
//  var options = {};
//
//  options.query = { _feed: feedId };
//
//  var mapper = function() {
//
//    var key = {
//      streetName: this.nonHouseAddress.streetName,
//      city: this.nonHouseAddress.city,
//      zip: this.nonHouseAddress.zip,
//      streetDirection: this.nonHouseAddress.streetDirection,
//      streetSuffix: this.nonHouseAddress.streetSuffix,
//      addressDirection: this.nonHouseAddress.addressDirection
//    };
//
//    var value = {
//      startHouseNumber: this.startHouseNumber,
//      endHouseNumber: this.endHouseNumber,
//      elementId: this.elementId
//    };
//
//    if(this.oddEvenBoth === "both") {
//      key.oddEvenBoth = "even";
//      emit(key, value);
//      key.oddEvenBoth = "odd";
//      emit(key, value);
//    }
//    else {
//      key.oddEvenBoth = this.oddEvenBoth;
//      emit(key, value);
//    }
//  };
//
//  options.map = mapper;
//
//  options.reduce = function(key, values) {
//    var overlap = [];
//
//    for(var x = 0; x < values.length; x++) {
//
//      for(var y = 0; y < values.length; y++) {
//        if(x === y)
//          continue;
//
//        var isOverlapping = false;
//
//        if( values[x].startHouseNumber <= values[y].endHouseNumber || values[x].startHouseNumber >= values[y].startHouseNumber )
//          isOverlapping = true;
//        if( values[x].endHouseNumber >= values[y].startHouseNumber || values[x].endHouseNumber <= values[y].endHouseNumber)
//          isOverlapping = true;
//
//
//        if(isOverlapping) {
//
//          var isContained = false;
//
//          for(var iter = 0; iter < overlap.length; ++iter) {
//            if(overlap[iter].leftElementId === values[x].elementId && overlap[iter].rightElementId === values[y].elementId)
//              isContained = true;
//            if(overlap[iter].leftElementId === values[y].elementId && overlap[iter].rightElementId === values[x].elementId)
//              isContained = true;
//          }
//
//          if(!isContained) {
//            overlap.push({
//              leftElementId: values[x].elementId,
//              rightElementId: values[y].elementId,
//              id: values[x].id
//            });
//          }
//        }
//      }
//    }
//
//    return { overlap: overlap };
//  };
//
//  options.finalize = function(key, reduced) {
//    if( reduced.overlap )
//      return reduced
//  };
//
//  var Model = mongoose.model(constraintSet.entity[0]);
//
//  Model.mapReduce(options, function(err, results) {
//
//    if(err) {
//      console.log(err);
//      process.exit(-1);
//    }
//
//    // loop through the results from the aggregate
//    for (var resIter = 0; resIter < results.length; resIter++) {
////      if(results[resIter].value.elementId)
////        continue;
//      if(!results[resIter].value)
//        continue;
//
//      saveValues(results[resIter].value.overlap);
//    }
//    callback({promisedErrorCount: errorCount})
//  });
//
//}
//
//var both = [];
//function saveValues(overlap) {
//  overlap.forEach(function(doc) {
//
//    var isContained = false;
//    for(var iter = 0; iter < both.length; ++iter) {
//      if(both[iter].leftElementId === doc.leftElementId && both[iter].rightElementId === doc.rightElementId)
//        isContained = true;
//      if(both[iter].leftElementId === doc.rightElementId && both[iter].rightElementId === doc.leftElementId)
//        isContained = true;
//    }
//
//    if(!isContained) {
//      var error = "overlaps with elementId: " + doc.rightElementId;
//      createError(0, doc.leftElementId, doc.id, error);
//      both.push(doc);
//    }
//
//  });
//}

//function intervalTree(values) {
//
//  var errorTexts = [];
//  // tree interval creation
//  var tree = new interval.SegmentTree;
//  tree.clearIntervalStack();
//
//  for (var x = 0; x < values.length; x++) {
//    var value = values[x];
//
//    errorTexts.push("{" + "id: " + value.elementId + ", startHouseNumber: " + value.startHouseNumber + ", endHouseNumber: " + value.endHouseNumber +  ", oddEvenBoth: " + value.oddEvenBoth + "}");
//    tree.pushInterval(value.startHouseNumber, value.endHouseNumber);
//  }
//
//  // build the tree
//  tree.buildTree();
//  //query to see if there are any overlaps returned
//  var treeResults = tree.queryOverlap();
//
//  //console.log(treeResults);
//
//  // go through the tree overlap results
//  for (var j = 0; j < treeResults.length; j++) {
//    if (treeResults[j].overlap.length > 0) {
//      // if we have overlaps
//      for (var k = 0; k < treeResults[j].overlap.length; k++) {
//        var treeOverlap = treeResults[j];
//        var index = treeOverlap.overlap[k];
//        index = parseInt(index);
//
//        // turn the 1 based index of the treeInterval into a 0 based index of a js array
//        index--;
//
//        var errors = errorTexts[j] + '\n' + errorTexts[index];
//        createError(0, values[j].elementId, values[j].id, errors)
//      }
//    }
//  }
//}


function evaluate(constraintSet, callback) {
  var Model = mongoose.model(constraintSet.entity[0]);

  Model.aggregate()
    .match( { _feed: feedId } )
    .group({
      _id: {
        /*streetName: "$nonHouseAddress.streetName",*/
        zip: "$nonHouseAddress.zip"
      },
      count: { $sum: 1 }
    })
    .match({ count : { $gt : 1 }})
    /*.sort({ count: 1 })*/
    .exec(function(err, results) {
      if(err) {
        console.log(err);
        process.exit(-1);
      }

      async.forEachSeries(results, function (result, done) {

        if(!result._id.zip) {
          done();
          return;
        }

        Model.find({ _feed: feedId, "nonHouseAddress.zip": result._id.zip }, { "nonHouseAddress.streetName": 1, startHouseNumber: 1, endHouseNumber: 1, oddEvenBoth: 1, elementId: 1, _id: 1 })
          .exec(function (err, docs) {

            if(!docs.length || !docs[0].nonHouseAddress.streetName) {
              done();
              return;
            }

            var tree = new interval.SegmentTree;
            tree.clearIntervalStack();

            for (var resIter = 0; resIter < docs.length; ++resIter) {
              tree.pushInterval(docs[resIter].startHouseNumber, docs[resIter].endHouseNumber);
            }

            tree.buildTree();
            var treeResults = tree.queryOverlap();

            for (var j = 0; j < treeResults.length; j++) {
              if (treeResults[j].overlap.length > 0) {
                for (var k = 0; k < treeResults[j].overlap.length; k++) {
                  var treeOverlap = treeResults[j];
                  var index = treeOverlap.overlap[k];
                  index = parseInt(index) - 1;

                  if(docs[j].oddEvenBoth === docs[index].oddEvenBoth || docs[j].oddEvenBoth === 'both' || docs[index].oddEvenBoth === 'both') {
                    if(docs[j].nonHouseAddress.streetName === docs[index].nonHouseAddress.streetName) {
                      var errors = "overlaps with elementId: " + docs[index].elementId;
                      createError(0, docs[j].elementId, docs[j].id, errors)
                    }
                  }
                }
              }
            }

            done();
          });
      }, function() { callback({promisedErrorCount: errorCount}); });
    });
}

function createError(streetsegment, elementId, mongoId, error) {
  errorCount++;
  var ruleErrors = new ruleViolation(constraints.entity[0], elementId, mongoId, feedId, error, error, rule);
  return ruleErrors.model().save();
}

exports.evaluate = evaluateStreetSegmentsOverlap;
