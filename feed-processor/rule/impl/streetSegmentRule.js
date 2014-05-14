var mongoose = require('mongoose');
var schemas = require('../../../dao/schemas');
var async = require('async');
var config = require('../../../config');

var _ = require('underscore');

var interval = require('interval-query');

var singleState = require('./streetSegmentSingle');

var logger = (require('../../../logging/vip-winston')).Logger;

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

  schemas.models.feeds.findOne( { _id: feedId }, function(err, feed) {

    if(err) {
      console.log(err);
      process.exit(1);
    }

    if(!feed) {
      console.log("could not find feed");
      process.exit(1);
    }

    if(config.checkSingleHouseStates(feed.fipsCode))
      singleState.evaluateStreetSegmentsOverlapSingle(feedId, constraintSet, ruleDefinition, callback);
    else
      evaluate(constraintSet, callback);
  });
};

function evaluate(constraintSet, callback) {
  var Model = mongoose.model(constraintSet.entity[0]);

  Model.aggregate()
    .match( { _feed: feedId } )
    .group({
      _id: {
        zip: "$nonHouseAddress.zip"
      },
      count: { $sum: 1 }
    })
    .match({ count : { $gt : 1 }})
    .exec(function(err, results) {

      if(err) {
        console.log(err);
        process.exit(1);
      }

      logger.profile("streetSegmentRule.evaluate: async finds for, " + results.length);
      async.eachSeries(results, function (result, done) {

        if(!result._id.zip) {
          done();
          return;
        }

        Model.find({ _feed: feedId, "nonHouseAddress.zip": result._id.zip },
          {
            "nonHouseAddress.streetName": 1,
            "nonHouseAddress.streetDirection": 1,
            "nonHouseAddress.streetSuffix": 1,
            "nonHouseAddress.addressDirection": 1,
            startHouseNumber: 1,
            endHouseNumber: 1,
            oddEvenBoth: 1,
            elementId: 1,
            _id: 1
          })
          .exec(function (err, docs) {
            if(!docs.length || !docs[0].nonHouseAddress.streetName) {
              done();
              return;
            }

            checkOverlap(docs, createError);
            done();
          });
      }, function() {
        logger.profile("streetSegmentRule.evaluate: async finds for, " + results.length);
        callback({promisedErrorCount: errorCount});
      });
    });
}

function createError(elementId, mongoId, error) {
  errorCount++;
  var model =  mongoose.model(constraints.entity[0].substring(0, constraints.entity[0].length-1) + 'errors');
  return model.create({
    severityCode: rule.severityCode,
    severityText: rule.severityText,
    errorCode: rule.errorCode,
    title: rule.title,
    details: error,
    textualReference: 'id = ' + elementId + " (" + error + ")",
    refElementId: elementId,
    _ref: mongoId,
    _feed: feedId
  });
}

function checkOverlap(docs, createError) {

  var tree = new interval.SegmentTree;
  tree.clearIntervalStack();

  var empty = true;
  for (var resIter = 0; resIter < docs.length; ++resIter) {
    if(_.isNumber(docs[resIter].startHouseNumber) && _.isNumber(docs[resIter].endHouseNumber) && docs[resIter].startHouseNumber < docs[resIter].endHouseNumber) {
      empty = false;
      tree.pushInterval(docs[resIter].startHouseNumber, docs[resIter].endHouseNumber);
    }
  }

  if(empty) {
    return;
  }

  tree.buildTree();
  var treeResults = tree.queryOverlap();

  for (var j = 0; j < treeResults.length; j++) {
    if (treeResults[j].overlap.length > 0) {
      for (var k = 0; k < treeResults[j].overlap.length; k++) {
        var treeOverlap = treeResults[j];
        var index = treeOverlap.overlap[k];
        index = parseInt(index) - 1;

        if(docs[j].oddEvenBoth == docs[index].oddEvenBoth || docs[j].oddEvenBoth == 'both' || docs[index].oddEvenBoth == 'both') {
          if(docs[j].nonHouseAddress.streetName == docs[index].nonHouseAddress.streetName &&
            docs[j].nonHouseAddress.streetDirection == docs[index].nonHouseAddress.streetDirection &&
            docs[j].nonHouseAddress.streetSuffix == docs[index].nonHouseAddress.streetSuffix &&
            docs[j].nonHouseAddress.addressDirection == docs[index].nonHouseAddress.addressDirection) {
            var errors = "overlaps with elementId: " + docs[index].elementId;
            createError(docs[j].elementId, docs[j].id, errors)
          }
        }
      }
    }
  }
}

exports.evaluate = evaluateStreetSegmentsOverlap;
exports.streetSegmentEval = checkOverlap;
