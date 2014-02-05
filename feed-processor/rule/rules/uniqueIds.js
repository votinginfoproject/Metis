/**
 * Created by bantonides on 1/22/14.
 */
function UniqueIdRule(models, rule) {
  this.models = models;
  this.rule = rule;
}

UniqueIdRule.prototype.performCheck = function(feedId) {
  var when = require('when');

  var finds = [];

  this.rule.collections.forEach(function(m) {
    finds.push(this.models[m].find({ _feed: feedId }).select('elementId').exec());
  }, this);

  when.all(finds).then(processQueryResults.bind(this), errorHandler);
};

function check(models, feedId, rule) {
  var rule = new UniqueIdRule(models, rule);
  rule.performCheck(feedId);
}

function errorHandler(err) {
  console.error(err);
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
      saveError(errModel, dupe.id, context);
    });
  });
  console.log('Done storing errors.');
}

function saveError(errorModel, id, context) {
  errorModel.model.create({
    severityCode: context.rule.severityCode,
    severityText: context.rule.severityText,
    errorCode: context.rule.errorCode,
    title: context.rule.title,
    details: context.rule.description,
    textualReference: 'id = ' + id,
    _ref: errorModel.ref
  }, function(err, data, count) {
    if (err) {
      console.error(err);
    }
  });
};

exports.runCheck = check;