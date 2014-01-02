/**
 * Created by bantonides on 12/20/13.
 */
var config = require('../config');
var mongoose = require('mongoose');
var schemas = require('../dao/schemas');
var xmlProc = require('./xmlProcessor');

var db;

function connectMongo(connectionString, next) {
  mongoose.connect(connectionString);
  db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error: '));
  db.once('open', function callback(){
    console.log("initialized VIP database via Mongoose");
    next();
  });
};

function initiateFeedParsing(path) {
  schemas.initSchemas(mongoose);

  connectMongo(config.mongoose.connectionString, function () {
      xmlProc.processXml(schemas, path);
  });
};

if (process.argv.length > 2 && process.argv[2] != null) {
  initiateFeedParsing(process.argv[2]);
}
else {
  console.error("ERROR: insufficient arguments provided \n");

  console.log("Usage: node  <javascript_file_name>  <relative_xml_file_path>");
  console.log("");
  process.exit();
}
