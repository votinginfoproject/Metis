var logger = (require('../logging/vip-winston')).Logger;
var meld = require('meld');

/*
 * Sets ups AOP advice for Asynch functions that return response.json data
 * Currently used for HttpCallbacks.js functions
 */
var profileAsyncJsonResponse = function(moduleName, obj){

  function setupAdvice(obj, funcName){

    return function(){

      meld.before(obj, funcName, function(){

        var profileString = 'Profile ' + moduleName + "." + funcName;
        logger.profile(profileString);

        // get the res object
        var res = arguments[1];
        meld.after(res, 'json', function(){

          logger.profile(profileString);
        })

      })

    };

  }

  for(var funcName in obj){
    var doAdvice = setupAdvice(obj, funcName);
    doAdvice();
  }

}

exports.profileAsyncJsonResponse = profileAsyncJsonResponse;