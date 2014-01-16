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