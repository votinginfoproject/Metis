/**
 * Created by nboseman on 12/25/13.
 */
var mongoose = require('mongoose');
var config = require('../../config');
var thisModelName = null;

function RuleViolation(entity, elementId, mongoObjectId, feedId, details, item, ruleDef){
  this.entity = entity;
  this.refElementId = elementId;
  this.details = details;
  this.refEntityId = mongoObjectId;
  this.feedId = feedId;
  this.ruleDef = ruleDef;
  this.textualReference = item;
}

RuleViolation.prototype.model = function(modelName){
  var Violation = null;
  if(modelName == null || modelName.trim() == ""){
    thisModelName = deriveErrorSchema(this.entity);

    //TODO: enhance debug here with console.log('created derived model for', thisModelName);
    Violation = mongoose.model(thisModelName);
  }
  else {
    //TODO: enhance debug here with console.log('create model for', modelName);
    Violation = mongoose.model(modelName);
    thisModelName = modelName;
  }
  //console.log(thisModelName);
  Model = new Violation({
    severityCode: this.ruleDef.severityCode,
    severityText: this.ruleDef.severityText,
    errorCode: this.ruleDef.errorCode,
    title: this.ruleDef.title,
    details: this.ruleDef.errorText,
    textualReference: 'id = ' + this.refElementId + " (" + this.textualReference + ")",
    refElementId: this.refElementId,
    _ref: this.refEntityId,
    _feed: this.feedId
  });
  //TODO: enhance debug here with console.log(Model);
  return Model;
}

function deriveErrorSchema(entity){
  return (entity.substring(0,entity.length-1) + 'Errors');
}

RuleViolation.prototype.save = function(){
  //TODO: enhance debug here with console.log('about to save', thisModelName);
  //TODO: enhance error handling here with try catch
  if(config.ruleEngine.isPersistent){
    this.model().save();
  }
  else {
    console.log(
      "**Rule (errorCode:", this.ruleDef.errorCode + ") -",
      deriveErrorSchema(this.entity), this.textualReference);
  }
}

module.exports = RuleViolation;