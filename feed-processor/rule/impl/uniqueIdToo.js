/**
 * Created by nboseman on 2/11/14.
 */

var schemas = require('../../../dao/schemas');
var masterIdCollection = [];
var mongoose = require('mongoose');

var evaluateUniqueId = function(feedId, constraintSet, ruleDef){
  var when = require('when');

  console.log("feedId", feedId);
  var finds = [];
  if(masterIdCollection.length == 0){
    constraintSet.entity.forEach(function(model) {
    collectionName = model
      Model = mongoose.model(model);
      finds.push(Model.find({ _feed: feedId }).select('elementId').exec());
    }, this);

    when.all(finds)
      .then(processQueryResults.bind(this), errorHandler);
  }else
  console.log('do nothing');

  return when.resolve({ isViolated: false });
}

function errorHandler(err) {
  if (err) {
    console.error(err);
  }
}

function processQueryResults(foundDocs) {
  console.log('All queries completed.');

  console.log(masterIdCollection);
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
      console.log('dupe found');
      savePromises.push(saveError(context, errModel, dupe.id, feedId));
    });
  });

  when.all(savePromises).then(context.callback, errorHandler);
}


  function saveError(context, errorModel, id) {
    //context.refCount++;
    console.log('Saving error: ');
    console.log('id=', id);
    console.log(context);
    //errorModel.model.create({
// createHandler.bind(context));

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
