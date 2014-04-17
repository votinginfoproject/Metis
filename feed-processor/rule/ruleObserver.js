/**
 * Created by nboseman on 2/10/14.
 */

var activeRules = {};

var ActiveRuleStats = {
  overallCount: 0,
  errorCount: 0,
  increaseRuleCount: function(ruleDef){
    this.overallCount++;
    activeRules[ruleDef.title] = this.resolveRuleCount(ruleDef) + 1;
  },
  decreaseRuleCount: function(ruleDef){
    this.overallCount--;
    activeRules[ruleDef.title] = this.resolveRuleCount(ruleDef) - 1;
  },
  resolveRuleCount: function(ruleDef){
    return activeRules[ruleDef.title] ? activeRules[ruleDef.title] : 0;
  },
  applyRule: function(ruleDef){
    activeRules[ruleDef.title] = NaN;
  },
  logRuleViolation: function(){
    //activeRules['errors'] = violations.length;
  },
  statusRuleCount: function(){
    //TODO: do a little more here than return the rules. Show trends, etc
    return activeRules;
  },
  atTerminalState: function(){
    canTerminate = false;
    sum = 0;
    for(var my in activeRules){
      if(activeRules.hasOwnProperty(my)){
        sum += parseInt( activeRules[my]);
      }
    }
    if(sum == 0)
      canTerminate = true;
    return canTerminate;
  }
};

module.exports = ActiveRuleStats;