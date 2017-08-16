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
 * Checks for the specific textual_references prperty for a set of errors and if it detects
 * the presence of XML, it adds indentation styling to the text
 *
 * This is an Errors object specific function
 */
vipApp_ns.findAndIndent = function(data) {

  // indent XML data
  if (data != null && data.length > 0) {

    // loop over each error group
    for (var i = 0; i < data.length; i++) {

      // loop over each textual_reference
      data[i]._code = [];
      for (var j = 0; j < data[i].textual_references.length; j++) {

        // simple check to see if potentially xml data
        if (data[i].textual_references[j].charAt(0) === "<" && data[i].textual_references[j].charAt(data[i].textual_references[j].length - 1) === ">") {
          // add indentation
          data[i].textual_references[j] = vkbeautify.xml(data[i].textual_references[j]);
          // also add in a property to mark this to be presented in <pre> and <code> tags
          data[i]._code[j] = true;
        } else {
          data[i]._code[j] = false;
        }

      }
    }
  }
}

/*
 * Counts all the errors / a aggregation of total textual references
 *
 * This is an Errors object specific function
 */
vipApp_ns.countAllErrors = function(data) {

  var count = 0;

  // indent XML data
  if (data != null && data.length > 0) {

    // loop over each error group
    for (var i = 0; i < data.length; i++) {
      count += data[i].error_count;
    }
  }

  return count;
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
