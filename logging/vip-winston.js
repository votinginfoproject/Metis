/**
 * A module that adds a layer of abstraction to Winston to allow logger.error() calls to go to a different file than
 * all other logger.xxx() statements, without needing to use separate loggers.
 */
var config = require('./../config');
var winston = require('winston');
var fs = require('fs');
require('winston-mongodb').MongoDB;

// Note, don't add log level coloring to winston, it will add extra escaped characters to the log

// Create the log folder if it doesn't exist. Throw an error if we get any error besides the 'folder already exists' error
try {
  fs.mkdirSync(config.log.logpath);
} catch(err){
  if(err.code != 'EEXIST'){
    throw "Could not create log folder " + err;
  }
}

// 1) REGULAR LOGGER
// Our regular logger will log all non "error" levels, or at the max level specified by the 'loglevel' property
// to its own file and to the console (Potential Log levels handled: debug, info, warn).
// It will also log 'uncaught exceptions' to its own file and to the console.
var logger = new (winston.Logger)({
  transports: [
    new winston.transports.File({
        filename: config.log.logpath + config.log.logname,
        level: config.log.loglevel,
        maxsize: 1024 * 1024 * config.log.maxsizeMB,
        maxFiles: config.log.maxFiles,
        json: false
    }),
    new winston.transports.Console({
      // no options on purpose, using all default option values
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({
        filename: config.log.logpath + config.log.lognameExceptions,
        maxsize: 1024 * 1024 * config.log.maxsizeMB,
        maxFiles: config.log.maxFiles,
        json: false
    }),
    new winston.transports.Console({
      json: true
    })
  ]
});

// 2) ERROR LOGGER
// Logs only 'error' level logs to its own file. Not logging to the console as we
// are also sending the error logs to the regular logger which will log to the console.
var errorLogger = new (winston.Logger)({
  transports: [
    new winston.transports.File({
        filename: config.log.logpath + config.log.lognameErrors,
        level: "error", // hardcoded to 'error' level
        maxsize: 1024 * 1024 * config.log.maxsizeMB,
        maxFiles: config.log.maxFiles,
        json: false
    })
  ]
});

// 3) PROFILE LOGGER
// Logs 'profile' log statements to Mongo, to the regular log file, and to the console
var profileLogger = new (winston.Logger)({
  transports: [
    new winston.transports.File({
      filename: config.log.logpath + config.log.logname,
      level: config.log.loglevel,
      maxsize: 1024 * 1024 * config.log.maxsizeMB,
      maxFiles: config.log.maxFiles,
      json: false
    }),
    new winston.transports.Console({
      // no options on purpose, using all default option values
    }),
    new winston.transports.MongoDB({
        db: config.log.logProfileMongoDB,
        collection: config.log.logProfileMongoDBCollection
    })
  ]
});

// ====================================================================================================
// ====================================================================================================

// Our Logging class
var Logging = function(){
  var _loggers = {
    profile:  function(arg){
      profileLogger.profile(arg);
    },
    // Log function not implemented
    //log:  function(){
    //},
    debug:    logger.debug,
    info:     logger.info,
    warn:     logger.warn,

    // using a different logger for the 'error' level so we can pipe the output to a different File transport,
    // since you can't have 2 different File Transports for the same logger. Also sending errors to the regular
    // log file also.
    error:    function(){
      // calling the actual error functions for each logger with the arguments that were passed in
      logger.error.apply(null, arguments);
      errorLogger.error.apply(null, arguments);
    }
  };

  this.getLogger = function (){
    return _loggers;
  }
};


// the node file requiring this module will need to use something similar to:
// var logger = (require('<path>/vip-winston')).Logger;
exports.Logger = (new Logging()).getLogger();