/**
 * Created by bantonides on 12/20/13.
 */
function BaseModel(models, feedId) {
  this.models = models;
  this.feedId = feedId;
};

BaseModel.prototype.save = function(onerror, onsuccess) {
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


module.exports = BaseModel;