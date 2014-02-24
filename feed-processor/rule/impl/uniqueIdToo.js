/**
 * Created by nboseman on 2/11/14.
 */

var schemas = require('../../../dao/schemas');
var mongoose = require('mongoose');
var ruleViolation = require('../ruleviolation');
var when = require('when');
var deferred = when.defer();

var rule = null;

var evaluateUniqueId = function(feedId, constraintSet, ruleDefinition){
  var when = require('when');
  rule = ruleDefinition;

  var finds = [];
    constraintSet.entity.forEach(function(model) {
      Model = mongoose.model(model);
      finds.push(Model.find({ '_feed': feedId },{'elementId':1,'_feed':1}).exec());
    }, this);

    when.all(finds)
      .then(processQueryResults, errorHandler);

  return deferred.promise;
}

function errorHandler(err) {
  if (err) {
    console.error(err);
  }
}

function processQueryResults(foundDocs) {
  //console.log('All queries completed.');

  var idCounts = {};

  var docs = Array.prototype.concat.apply([], foundDocs);
  docs.forEach(function (doc) {
    var id = doc.elementId;
    if (idCounts[id] === undefined) {
      idCounts[id] = { count: 0, errorModel: [] };
    }
    idCounts[id].count++;
    idCounts[id].errorModel.push( { model: doc.constructor.Error, _feed: doc._feed, _ref: doc._id, doc: doc });
  });

  storeErrors(filterDuplicates(idCounts));
  this.complete = true;
  //console.log('processQueryResults complete');
}

function filterDuplicates(idCounts) {
 // console.log('Filtering duplicates.');
  var duplicateIds = Object.keys(idCounts).filter(function(key) {
    return idCounts[key].count > 1;
  });

  var duplicates = [];

  duplicateIds.forEach(function(id) {
    idCounts[id].id = id;
    duplicates.push(idCounts[id]);
  });

  return duplicates;
}

function storeErrors(dupes, feedId) {
  //console.log('Storing errors.');
  var savePromises = [];

  dupes.forEach(function(dupe) {
    dupe.errorModel.forEach(function(errModel) {
      savePromises.push(createError(errModel, dupe.id));
    });
  });

  when.all(savePromises).then(function(promisedErrors){ deferred.resolve({ isViolated: false, errorList: promisedErrors});});
}


  function createError(errorModel, id) {
    ruleErrors = new ruleViolation(null, errorModel.elementId, errorModel._id, errorModel._feed, "elementId = " + id, "elementId = " + id, rule);
    violation = ruleErrors.model(errorModel.model.modelName);
    return violation.save();
  }


exports.evaluate = evaluateUniqueId;