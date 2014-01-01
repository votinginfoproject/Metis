/**
 * Created by nboseman on 12/31/13.
 */

function MetisRule(ruleDef, constraints){
  this.ruleDef = ruleDef;
  this.constraints = constraints;
  this.violations = [];
}


MetisRule.prototype.evaluate = function(){
  //given a rule def, apply the given data constraints to the rule
  constraints.forEach(function(err, constraint){
    this.hasViolation = this.ruleDef.evaluate(constraint);

    //if rule is violated, added to collection
    if(this.hasViolation){
      this.addViolation(require('./violation').newInstance(ruleDef.name, constraint, ruleDef.description));
    }
  });
}

MetisRule.protoytype.isViolated = function() {
  hasViolation = (this.violations.length > 0);
  return hasViolation;
}

MetisRule.protoytype.violationList = function() {
  return this.violations;
}

MetisRule.prototype.addViolation = function(violation) {
  this.violations.push(violation);
}

function getInstance(ruleDef, constraints){
  return new Rule(ruleDef, constraints);
}

exports.getInstance = getInstance;