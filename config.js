/**
 * Created by bantonides on 11/21/13.
 */
var config = {};

config.web = {
  port: process.env.PORT || 4000,
  favicon: 'public/assets/images/favicon.ico',
  loglevel: 'dev',
  sessionsecret: 'ssshh!!'
};

config.crowd = {
  server: 'http://192.168.10.160:8095/crowd/',
  application: 'votinginfoapp',
  apppass: 'thisissecret',
  retrieveGroups: true,
  uselocalauth: true
};

/**
 * vipModel contains data regarding db schema model values
 * @type {{feed: string, election: string, source: string}}
 */
config.mongoose = {
  model: {
    feed: "Feed",
    election: "Election",
    source: "Source"
  },
  connectionString: "mongodb://localhost/vipfeed"
}

module.exports = config;