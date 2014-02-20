
/*  for external testing */

var mongoose = require('mongoose');
var schemas = require('../../dao/schemas');
var config = require('../../config');

function connectMongo(connectionString, next) {
  mongoose.connect(connectionString);
  db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error: '));
  db.once('open', function callback(){
    console.log("initialized VIP database via Mongoose");
    next();
  });
}

function executeProg(vipFeedId) {
  schemas.initSchemas(mongoose);
  connectMongo(config.mongoose.connectionString, function () {
    require('./rulesengine').processRules(vipFeedId);
  });
}

executeProg(process.argv[2]);