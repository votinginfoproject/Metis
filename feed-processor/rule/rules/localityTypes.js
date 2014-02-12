/**
 * Created by bantonides on 2/12/14.
 */
var util = require('util');
var when = require('when');

function LocalityTypesRule(models, rule, feedId, callback) {
  this.models = models;
  this.rule = rule;
  this.callback = callback;
  this.feedId = feedId;
}

LocalityTypesRule.prototype.performCheck = function() {
  this.rule.collections.forEach(checkCollection.bind(this));
};

function errorHandler(err) {
  if (err) {
    console.error(err);
  }
}

function checkCollection(collection) {
  this.models[collection.name].find({ _feed: this.feedId })
    .where(collection.field).nin(this.rule.acceptableValues)
    .exec(processErrors.bind(this));
}

function processErrors(err, badLocalities) {
  if (err || !badLocalities) {
    errorHandler(err);
    this.callback('localityType');
  }
  else {
    var promises = badLocalities.map(processError.bind(this));
    when.all(promises).then(this.callback, errorHandler);
  }
}

function processError(badLocality) {
  var errorModel = { model: badLocality.constructor.Error, ref: badLocality._id };
  return saveError(this, errorModel, badLocality.elementId, badLocality.type);
}

function saveError(context, errorModel, id, localityType) {
  return errorModel.model.create({
    severityCode: context.rule.severityCode,
    severityText: context.rule.severityText,
    errorCode: context.rule.errorCode,
    title: context.rule.title,
    details: context.rule.description,
    textualReference: util.format('Type: %s is not valid for element id = %d', localityType, id),
    refElementId: id,
    _ref: errorModel.ref,
    _feed: context.feedId
  });
}

function check(models, feedId, rule, callback) {
  console.log('Starting Locality Type rule validation.');
  var rule = new LocalityTypesRule(models, rule, feedId, callback);
  rule.performCheck();
}

exports.runCheck = check;