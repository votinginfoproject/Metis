/**
 * Created by nboseman on 1/29/14.
 */

var mongoose = require('mongoose');
var async = require('async');
var when = require('when');
var url = require('url');

var Violation = require('../ruleviolation');


var evaluateValidUrl = function(urlString, dataSet, entity, constraintSet, ruleDef){
  //TODO: refactor to switch statement for readability

  //var deferred = when.defer();
  parsedUrl = url.parse(urlString);
  isViolated = false;
  //Step 1: Does url conforms to a valid protocol (http or https only)?
  if(parsedUrl.protocol != null && parsedUrl.protocol == 'https:' || parsedUrl.protocol == 'http:'){
    //Step 2: Verify basic URL structure
    if(parsedUrl.slashes != null || parsedUrl.slashes){
      //Step 3: Verify the domain (hostname is distinguishable)
      if (parsedUrl.hostname != null && parsedUrl.hostname != ""){
        isViolated = false; //all tests pass
      }else {
        console.error("url check failure: no hostname provided", urlString);
        isViolated = true;
      }
    }else {
      console.error("slash check failed", urlString);
      isViolated = true;
    }
  }
  else {
    console.error("protocol check failed", urlString);
    isViolated = true;
  }

  //resultant = [isViolated, result, urlString, entity];
  if(isViolated){
    console.log('FAILURE:', urlString);
  }

  return when.resolve({isViolated: isViolated, dataItem: urlString, dataSet: dataSet, entity: entity, ruleDef: ruleDef});
};

exports.evaluate = evaluateValidUrl;