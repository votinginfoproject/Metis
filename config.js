/**
 * Created by bantonides on 11/21/13.
 */
var config = {};

config.web = {};

config.web.port = process.env.PORT || 4000;
config.web.favicon = 'public/assets/images/favicon.ico';
config.web.loglevel = 'dev';


module.exports = config;