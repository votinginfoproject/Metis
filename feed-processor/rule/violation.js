/**
 * Created by nboseman on 12/25/13.
 */

function Violation(collection, memberName, message, mongoObjectId, feedId){
  this.collection = collection;
  this.memberName = memberName;
  this.description = message;
  this.objectId = mongoObjectId;
  this.feedId = feedId;
}


Violation.prototype.toString = function(){
  toString({
    'collection': collection,
    "memberName": memberName,
    "description": description,
    "collectionId": objectId,
    "feedId": feedId
  });
};

Violation.prototype.model = function(){
  var Violation = require('mongoose').model("violations");
  return new Violation({
    collection: this.collection,
    memberName: this.memberName,
    description: this.description,
    objectId: this.objectId,
    feedId: this.feedId
  });
}

Violation.prototype.save = function(){
  if(require('../../config').ruleEngine.isPersistent)
    this.model().save();
  else
    console.log(
      "\n**Warning**: Violation captured as DEBUG only. The following will NOT be saved in mongo: \n",
      this,
      "\nTo store the above record in Mongo, update the RuleEngine setting in config.js\n"
    );
}

module.exports = Violation;