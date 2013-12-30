/**
 * Created by bantonides on 12/20/13.
 */
function BaseModel(models, feedId) {
  this.models = models;
  this.feedId = feedId;
};

BaseModel.prototype.save = function(onerror, onsuccess) {
  if (this.model === undefined) {
    return;
  }

  this.model.save(function (err, data) {
    if (err) { onerror(err); }
    else { onsuccess(data); }
  });
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
}


module.exports = BaseModel;