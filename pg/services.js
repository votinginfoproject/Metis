var pg = require("./gets.js");

function registerPostgresServices (app) {
  app.get('/db/results', function(req,res){ pg.getResults(req,res); });
  app.get('/db/validations', function(req,res){ pg.getValidations(req,res); });
  app.get('/db/validations/errorCount', function(req,res){ pg.getValidationsErrorCount(req,res); });
  app.get('/db/feeds/:feedid/contests', function(req,res){ pg.getFeedContests(req,res); });
  app.get('/db/feeds/:feedid/contests/overview', pg.getFeedContestsOverview);
  app.get('/db/feeds/:feedid/overview', pg.getFeedOverview);
  app.get('/db/feeds/:feedid/localities', pg.getFeedLocalities);
  app.get('/db/feeds/:feedid/election/state', pg.getFeedState);
  app.get('/db/feeds/:feedid/election/state/election-administrations', pg.getFeedElectionAdministrations);
  app.get('/db/feeds/:feedid/election', pg.getFeedElection);
  app.get('/db/feeds/:feedid/source', pg.getFeedSource);
}

exports.registerPostgresServices = registerPostgresServices;
