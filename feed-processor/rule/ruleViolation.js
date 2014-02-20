/**
 * Created by nboseman on 12/25/13.
 */
var mongoose = require('mongoose');
var config = require('../../config');
var isBaseModel = false;
var thisModel = null;

function RuleViolation(entity, elementId, mongoObjectId, feedId, details, item, ruleDef){
  this.entity = entity;
  this.elementId = elementId;
  this.details = details;
  this.refEntityId = mongoObjectId;
  this.feedId = feedId;
  this.ruleDef = ruleDef;
  this.textualReference = item;
}

//TODO: prototype toString()

RuleViolation.prototype.model = function(){
  var Violation = mongoose.model(deriveErrorSchema(this.entity));
  if(!isBaseModel){
    thisModel = new Violation({
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
  return thisModel;
}

RuleViolation.prototype.createModel = function(model){
  thisModel = model;
  if(model != null) {
    if(config.ruleEngine.isPersistent) {
      model.save();
    }
    else {
      console.log(
        "**Rule Error**: ",
        thisModel.ruleDef.errorCode, thisModel.entity, thisModel.textualReference);
    }
  }
}

function deriveErrorSchema(entity){
  return (entity.substring(0,entity.length-1) + 'Errors');
}

RuleViolation.prototype.save = function(){
  if(config.ruleEngine.isPersistent)
    this.model().save();
  else {
    console.log(
      "**Rule Error**: ", this.ruleDef.errorCode,
      deriveErrorSchema(this.entity), this.textualReference);
  }
}

module.exports = RuleViolation;