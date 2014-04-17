/**
 * Created by bantonides on 12/20/13.
 */
const
  BaseModel = function (models, feedId, collection) {
    this.models = models;
    this.feedId = feedId;
    this.collection = collection;
  };

BaseModel.prototype.save = function () {
  if (this.model === undefined || this.model.elementId == null) {
    return;
  }

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
    zip: address.zip
  };
};


module.exports = BaseModel;