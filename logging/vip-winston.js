/**
 * A module that adds a layer of abstraction to Winston to allow logger.error() calls to go to a different file than
 * all other logger.xxx() statements, without needing to use separate loggers.
 */
var config = require('./../config');
var winston = require('winston');
var fs = require('fs');

// Note, don't add log level coloring to winston, it will add extra escaped characters to the log

// Create the log folder if it doesn't exist. Throw an error if we get any error besides the 'folder already exists' error
try {
  fs.mkdirSync(config.log.logpath);
} catch(err){
  if(err.code != 'EEXIST'){
    throw "Could not create log folder " + err;
  }
}

var transports = [
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
];

if (config.log.papertrail) {
  require('winston-papertrail');
  transports.push(new winston.transports.Papertrail({
    host: config.log.papertrail.host,
    port: config.log.papertrail.port,
    hostname: config.log.papertrail.appname
  }))
}

// 1) REGULAR LOGGER
// Our regular logger will log all non "error" levels, or at the max level specified by the 'loglevel' property
// to its own file and to the console (Potential Log levels handled: debug, info, warn).
// It will also log 'uncaught exceptions' to its own file and to the console.
var logger = new (winston.Logger)({
  transports: transports,
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
// Logs 'profile' log statements to the regular log file, and to the console

// ** NOTE: Do not set maxsize and maxFiles on this logger as another logger above working on the same log file already has
// Doing so can cause the logger to crash.
var profileLogger = new (winston.Logger)({
  transports: [
    new winston.transports.File({
      filename: config.log.logpath + config.log.logname,
      level: config.log.loglevel,
      json: false
    }),
    new winston.transports.Console({
      // no options on purpose, using all default option values
    })
  ]
});


// 4) A SEPERATE PROFILE LOGGER
// Logs 'profile' log statements to the regular log file, and to the console
var profileSeparateLogger = new (winston.Logger)({
  transports: [
    new winston.transports.File({
      filename: config.log.logpath + config.log.lognameSeparateProfile,
      level: config.log.loglevel,
      maxsize: 1024 * 1024 * config.log.maxsizeMB,
      maxFiles: config.log.maxFiles,
      json: false
    }),
    new winston.transports.Console({
      // no options on purpose, using all default option values
    })
  ]
});



// ====================================================================================================
// ====================================================================================================

// Our Logging class
var Logging = function(){
  var _loggers = {
    profile:  function(arg){
      if(config.log.logProfileEnabled){
          profileLogger.profile(arg);
      }
    },
    profileSeparately:  function(arg){
      if(config.log.logProfileEnabled){
        profileLogger.profile(arg);
        profileSeparateLogger.profile(arg);
      }
    },
    // Log function not implemented the same as the underlying Winston Log function, simply forwarding to info()
    //log:  function(){
    //},
    log:      logger.info,

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
