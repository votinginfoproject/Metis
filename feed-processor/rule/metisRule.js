/**
 * Created by nboseman on 12/31/13.
 */

function MetisRule(ruleDef, constraints, helper){
  this.ruleDef = ruleDef;
  this.constraints = constraints;
  this.helper = helper;
  this.violations = [];
}


MetisRule.prototype.evaluate = function(vipFeedId, constraintList){
  //given a rule def, apply the given data constraints to the rule
  console.log("Evaluate constraint:", this.constraints);
  this.helper.evaluate(vipFeedId, this.constraints);
  //assessEvaluation();
}

MetisRule.prototype.isViolated = function() {
  hasViolation = (this.violations.length > 0);
  return hasViolation;
}

MetisRule.prototype.addViolation = function(violation) {
  this.violations.push(violation);
}

MetisRule.prototype.violationList = function(){
  return this.violations;
}

function getInstance(ruleDef, constraints, helper){
  return new MetisRule(ruleDef, constraints, helper);
}

MetisRule.prototype.getInstance = function(){
  //to be implemented by descendants
}


//exports.getInstance = getInstance;
module.exports = MetisRule;




