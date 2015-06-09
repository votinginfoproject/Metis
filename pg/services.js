var pg = require("./gets.js");

function registerPostgresServices (app) {
  app.get('/db/results', function(req,res){ pg.getResults(req,res); });
  app.get('/db/validations', function(req,res){ pg.getValidations(req,res); });
  app.get('/db/validations/errorCount', function(req,res){ pg.getValidationsErrorCount(req,res); });
}

exports.registerPostgresServices = registerPostgresServices;