/**
 * Created by nboseman on 12/25/13.
 */

function Violation(collection_name, member_name, message, mongoObjectId, feedId){
  this.collection = collection_name;
  this.member_name = member_name;
  this.description = message;
  this.objectId = mongoObjectId;
  this.feedId = feedId;
}


Violation.prototype.toString = function(){
  toString({
    'collection': collection,
    "memberName": member_name,
    "description": description,
    "collectionId": objectId,
    "feedId": feedId
  });
};

Violation.prototype.model = function(){
  var Violation = mongoose.model("violations");
  return new Violation({
    collection: this.collection,
    memberName: this.member_name,
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