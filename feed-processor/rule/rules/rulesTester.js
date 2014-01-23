/**
 * Created by bantonides on 1/22/14.
 */
var config = require('../../../config');
var mongoose = require('mongoose');
var schemas = require('../../../dao/schemas');
var db;

initiateRuleTesting();

function connectMongo(connectionString, next) {
  mongoose.connect(connectionString);
  db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error: '));
  db.once('open', function callback(){
    console.log("initialized VIP database via Mongoose");
    next();
  });
};

function initiateRuleTesting() {
  schemas.initSchemas(mongoose);

  connectMongo(config.mongoose.connectionString, function () {
    var rulesList = require('./rulesList').rules;

    rulesList.forEach(function(rule) {
      require(rule.ruleImplementation).runCheck(schemas.models, '52e184773eb775d10e000004', rule);
    });
  });
};
