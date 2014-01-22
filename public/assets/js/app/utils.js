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
 * Checks for the specific textualReference prperty for a set of errors and if it detects
 * the presence of XML, it adds indentation styling to the text
 *
 * This is an Errors object specific function
 */
vipApp_ns.findAndIndent = function(data) {

  // indent XML data
  if (data != null && data.length > 0) {
    for (var i = 0; i < data.length; i++) {
      // simple check to see if potentially xml data
      if (data[i].textualReference.charAt(0) === "<" && data[i].textualReference.charAt(data[i].textualReference.length - 1) === ">") {
        // add indentation
        data[i].textualReference = vkbeautify.xml(data[i].textualReference);
        // also add in a property to mark this to be presented in <pre> and <code> tags
        data[i]._code = true;
      }
    }
  }

}