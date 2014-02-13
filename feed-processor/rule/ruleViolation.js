/**
 * Created by nboseman on 12/25/13.
 */
var mongoose = require('mongoose');
var config = require('../../config');

function Violation(entity, elementId, mongoObjectId, feedId, details, item, ruleDef){
  this.entity = entity;
  this.elementId = elementId;
  this.details = details;
  this.refEntityId = mongoObjectId;
  this.feedId = feedId;
  this.ruleDef = ruleDef;
  this.textualReference = item;
}

//TODO: prototype toString()

Violation.prototype.model = function(){
  var Violation = mongoose.model(deriveErrorSchema(this.entity));
  return new Violation({
    severityCode: this.ruleDef.severityCode,
    severityText: this.ruleDef.severityText,
    errorCode: this.ruleDef.errorCode,
    title: this.ruleDef.title,
    details: this.details,
    textualReference: this.textualReference,
    _ref: this.refEntityId,
    _feed: this.feedId
  });
}

function deriveErrorSchema(entity){
  return (entity.substring(0,entity.length-1) + 'Errors');
}

Violation.prototype.save = function(){
  if(config.ruleEngine.isPersistent)
    this.model().save();
  else
    console.log(
      "\n**Warning**: Violation captured as DEBUG only. The following will NOT be saved in mongo: \n",
     deriveErrorSchema(this.entity), this.model()  //,
     // "\nTo store the above record in Mongo, update the RuleEngine setting in config.js\n"
    );
}

module.exports = Violation;