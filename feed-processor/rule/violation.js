/**
 * Created by nboseman on 12/25/13.
 */

function Violation(element_name, member_name, description, objectId, feedId){
 this.element_name = element_name;
 this.member_name = member_name;
 this.description = description;
 this.objectId = objectId;
 this.feedId = feedId;
}


Violation.prototype.toString = function(){
  toString('element_name: ', element_name, "member_name: ", member_name, "description: ", description, "_id:", objectId, "feed_id:", feedId);
};

function newInstance(element, name, description, objId, feedId){
  return new Violation(element, name, description, objId, feedId);
}

exports.newInstance = newInstance;