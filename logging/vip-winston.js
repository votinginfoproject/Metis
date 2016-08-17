var config = require('./../config');
var winston = require('winston');

require('winston-syslog').Syslog;

winston.setLevels({
  emerg: 7,
  alert: 6,
  crit: 5,
  error: 4,
  warning: 3,
  notice: 2,
  info: 1,
  debug: 0
});

if (config.log.syslog.host && config.log.syslog.port) {
  winston.add(winston.transports.Syslog, config.log.syslog);
} else {
  winston.info("Not logging to Syslog");
}

exports.Logger = winston;
