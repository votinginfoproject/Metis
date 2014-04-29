/**
 * Created by bantonides on 12/20/13.
 */
const
  _ = require('underscore'),
  _s = require('underscore.string'),
  Types = require('mongoose').Types,
  BaseModel = function (models, feedId, collection) {
    this.models = models;
    this.feedId = feedId;
    this.collection = collection;
    this.version = "v3";
  };

BaseModel.prototype.save = function () {
  if (this.model === undefined || this.model.elementId === null) {
    return;
  }

  //Set the _id on the document before saving
  this.model._id = Types.ObjectId();

  this.checkRequiredFields();

  return this.collection.create(this.model);
};

BaseModel.prototype.convertYesNo = function (yesNoValue) {
  if (yesNoValue === undefined) {
    return undefined;
  }
  return "YES".toUpperCase() == yesNoValue.toUpperCase();
};

BaseModel.prototype.mapSimpleAddress = function (address) {
  if (address === undefined) {
    return undefined;
  }
  return {
    locationName: address.location_name,
    line1: address.line1,
    line2: address.line2,
    line3: address.line3,
    city: address.city,
    state: address.state,
    zip: address.zip,
    gisXY: address.gis_xy
  };
};

BaseModel.prototype.trimStrings = function () {
  if(this.model === undefined)
    return;

  _.values(this.model._doc).forEach(function (value) {
    if(_.isString(value)) {
      _s.trim(value);
    }
  })
};

BaseModel.prototype.checkRequiredFields = function () {
  var self = this;

  if (!self.collection.RequiredFields) {
    return;
  }

  self.collection.RequiredFields[self.version].forEach(function (requiredField) {
    if (!self.model[requiredField]) {
      self.collection.Error.create({
        severityCode: 1,
        severityText: 'Error',
        errorCode: 0,
        title: 'Missing Required Field',
        details: _s.sprintf('%s required field: %s is missing for element with id %s.', _s.capitalize(self.collection.collection.name), requiredField, self.model.elementId),
        textualReference: _s.sprintf('id = %s', self.model.elementId),
        refElementId: self.model.elementId,
        _ref: self.model._id,
        _feed: self.feedId
      }).then(function () { console.log('Wrote required field error for contest.'); });
    }
  });
}


module.exports = BaseModel;