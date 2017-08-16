'use strict';
/*
 * VIP App Utility functions
 *
 */

// VIP App nameSpace
var vipApp_ns = {};

/*
 * Returns a string camel cased
 */
vipApp_ns.camelCase = function(str) {
  return str.replace(/(?:^|\s)\w/g, function(match) {
    return match.toUpperCase();
  });
}

/*
 * Takes properties and puts them into the appropriate container
 *
 * @data - contains the unparsed properties
 * @$appProperties - the container the properties should be added to
 */
vipApp_ns.parseAndAddProperties = function(data, $appProperties) {

  var props = data.split("\n");

  // parse the properties file
  for(var i=0; i<props.length; i++){
    var prop = props[i];

    if(prop.trim().length!==0 && prop.trim().indexOf("//")!==0 && prop.split("=").length==2){

      var prop_kv = prop.split("=");

      // if the value is a number
      if(!isNaN(prop_kv[1])){
        prop_kv[1] = parseFloat(prop_kv[1]);
      }

      // adding the external properties to the appProperties object
      $appProperties[prop_kv[0]] = prop_kv[1];
    }
  }
}

/*
 * Uses the current time to add at the end of a request URL to avoid caching
 *
 */
vipApp_ns.cacheBuster = function() {
  return "?t=" + Math.random();
}
