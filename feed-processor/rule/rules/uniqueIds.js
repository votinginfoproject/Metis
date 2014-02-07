/**
 * Created by bantonides on 1/22/14.
 */
function UniqueIdRule(models, rule, callback) {
  this.models = models;
  this.rule = rule;
  this.callback = callback;
  this.complete = false;
  this.refCount = 0;
}

UniqueIdRule.prototype.performCheck = function(feedId) {
  var when = require('when');

  var finds = [];

  this.rule.collections.forEach(function(m) {
    finds.push(this.models[m].find({ _feed: feedId }).select('elementId').exec());
  }, this);

  when.all(finds).then(processQueryResults.bind(this), errorHandler);
};

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
    idCounts[id].id = id;
    duplicates.push(idCounts[id]);
  });

  return duplicates;
}

function storeErrors(dupes, context) {
  console.log('Storing errors.');
  dupes.forEach(function(dupe) {
    dupe.errorModel.forEach(function(errModel) {
      saveError(context, errModel, dupe.id);
    });
  });
  console.log('Done storing errors.');
}

function saveError(context, errorModel, id) {
  context.refCount++;
  errorModel.model.create({
    severityCode: context.rule.severityCode,
    severityText: context.rule.severityText,
    errorCode: context.rule.errorCode,
    title: context.rule.title,
    details: context.rule.description,
    textualReference: 'id = ' + id,
    _ref: errorModel.ref
  }, createHandler.bind(context));
}

function createHandler(err) {
  this.refCount--;
  errorHandler(err);
  if (this.complete && this.refCount <= 0) {
    console.log('Calling completion callback.');
    this.callback();
  }
}
function check(models, feedId, rule, callback) {
  var rule = new UniqueIdRule(models, rule, callback);
  rule.performCheck(feedId);
}

exports.runCheck = check;