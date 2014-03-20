/**
 * Created by nboseman on 2/11/14.
 */

var schemas = require('../../../dao/schemas');
var mongoose = require('mongoose');
var ruleViolation = require('../ruleviolation');
var async = require('async');

var rule = null;

var evaluateUniqueId = function(feedId, constraintSet, ruleDefinition, callback){
  rule = ruleDefinition;
  var totalErrorCount = 0;

  async.eachSeries(constraintSet.entity, function(model, done) {
    mongoose.model(model).find({ '_feed': feedId }, { 'elementId': 1, '_feed': 1 }, function(err, docs) {
      processQueryResults(docs, function(errorCount) {
        totalErrorCount += errorCount;
        done();
      });
    });
  }, function() {
    callback( { isViolated: false, promisedErrorCount: totalErrorCount } );
  });
}

function errorHandler(err) {
  if (err) {
    console.error(err);
  }
}

function processQueryResults(foundDocs, callback) {
  var idCounts = {};

  if(foundDocs.length === 0) {
    callback(0);
    return;
  }

  var docs = Array.prototype.concat.apply([], foundDocs);
  docs.forEach(function (doc) {
    var id = doc.elementId;
    if (idCounts[id] === undefined) {
      idCounts[id] = { count: 0, errorModel: [] };
    }
    idCounts[id].count++;
    idCounts[id].errorModel.push( { model: doc.constructor.Error, _feed: doc._feed, elementId: doc.elementId, _ref: doc._id, doc: doc });
  });

  filterDuplicates(idCounts, callback);
//  this.complete = true;
//  console.log('processQueryResults complete');
}

function filterDuplicates(idCounts, callback) {
  var duplicateIds = Object.keys(idCounts).filter(function(key) {
    return idCounts[key].count > 1;
  });

  var errorCount = 0;
  duplicateIds.forEach(function(id) {
    idCounts[id].id = id;
    idCounts[id].errorModel.forEach(function(model) {
      errorCount++;
      createError(model, idCounts[id].id);
    });
  });

  callback(errorCount);
}

//function storeErrors(dupes, feedId) {
//  //console.log('Storing errors.');
//  var savePromises = [];
//  errorCount = 0;
//  dupes.forEach(function(dupe) {
//    dupe.errorModel.forEach(function(errModel) {
//      errorCount++;
//      savePromises.push(createError(errModel, dupe.id));
//    });
//  });
//  when.all(savePromises).then(function(promisedErrors){ deferred.resolve({ isViolated: false, promisedErrorCount: errorCount });});
//}

function createError(errorModel, id) {
  var ruleErrors = new ruleViolation(null, errorModel.elementId, errorModel._id, errorModel._feed, "elementId = " + id, "elementId = " + id, rule);
  return ruleErrors.model(errorModel.model.modelName).save();
}


exports.evaluate = evaluateUniqueId;
