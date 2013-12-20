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

module.exports = BaseModel;