/**
 * Created by nboseman on 2/11/14.
 */

var schemas = require('../../../dao/schemas');
var mongoose = require('mongoose');
var violation = require('../ruleViolation');
var when = require('when');
var deferred = when.defer();

var evaluateUniqueId = function(feedId, constraintSet, ruleDef){
  var when = require('when');

  //console.log("feedId", feedId);
  var finds = [];
    constraintSet.entity.forEach(function(model) {
    collectionName = model
      Model = mongoose.model(model);
      finds.push(Model.find({ _feed: feedId }).select('elementId').exec());
    }, this);

    when.all(finds)
      .then(processQueryResults.bind(this), errorHandler);

  return deferred.promise;
}

function errorHandler(err) {
  if (err) {
    console.error(err);
  }
}

function processQueryResults(foundDocs) {
  console.log('All queries completed.');

  var idCounts = {};

  var docs = Array.prototype.concat.apply([], foundDocs);
  docs.forEach(function (doc) {
    var id = doc.elementId;
    if (idCounts[id] === undefined) {
      idCounts[id] = { count: 0, errorModel: [] };
    }
    idCounts[id].count++;
    idCounts[id].errorModel.push( { model: doc.constructor.Error, ref: doc._id });
  });

  storeErrors(filterDuplicates(idCounts), this);
  this.complete = true;
  console.log('processQueryResults complete');
}

  function filterDuplicates(idCounts) {
    console.log('Filtering dulicates.');
    var duplicateIds = Object.keys(idCounts).filter(function(key) {
      return idCounts[key].count > 1;
    });

    var duplicates = [];

    duplicateIds.forEach(function(id) {
      console.log('dupe found', id);
      idCounts[id].id = id;
      duplicates.push(idCounts[id]);
    });

    return duplicates;
  }

function storeErrors(dupes, feedId, context) {
  console.log('Storing errors.');
  var savePromises = [];

  dupes.forEach(function(dupe) {
    dupe.errorModel.forEach(function(errModel) {
      savePromises.push(saveError(context, errModel, dupe.id, feedId));
    });
  });

  //when.all(savePromises).then(context.callback, errorHandler).then(function(){deferred.resolve({ isViolated: false });});
  when.all(savePromises).then(function(){ console.log('resolving'); deferred.resolve({ isViolated: false });});
}


  function saveError(context, errorModel, id) {
    //context.refCount++;
    console.log('Saving error: ');

    //errorModel.model.create({
// createHandler.bind(context));
    console.log('id=', id);
    //console.log(errorModel);
    //console.log(context);
    /*console.log({
      severityCode: context.rule.severityCode,
      severityText: context.rule.severityText,
      errorCode: context.rule.errorCode,
      title: context.rule.title,
      details: context.rule.description,
      textualReference: 'id = ' + id,
      refElementId: id,
      _ref: errorModel.ref,
      _feed: feedId
    });*/

  }

/*
 function saveError(context, errorModel, id, feedId) {
 return errorModel.model.create({
 severityCode: context.rule.severityCode,
 severityText: context.rule.severityText,
 errorCode: context.rule.errorCode,
 title: context.rule.title,
 details: context.rule.description,
 textualReference: 'id = ' + id,
 refElementId: id,
 _ref: errorModel.ref,
 _feed: feedId
 });
 }
 */

  function createHandler(err) {
    this.refCount--;
    errorHandler(err);
    if (this.complete && this.refCount <= 0) {
      console.log('Calling completion callback.');
      this.callback();
    }

}

exports.evaluate = evaluateUniqueId;
