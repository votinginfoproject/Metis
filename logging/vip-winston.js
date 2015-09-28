var config = require('./../config');
var winston = require('winston');

require('winston-syslog').Syslog;

winston.setLevels(winston.config.syslog.levels);

if(config.log.syslog.host && config.log.syslog.port) {
  winston.add(winston.transports.Syslog, config.log.syslog);
} else {
  winston.info("Not logging to Syslog");
}

exports.Logger = winston;
