/**
 * Created by bantonides on 12/20/13.
 */
const
  config = require('../config'),
  mongoose = require('mongoose'),
  schemas = require('../dao/schemas'),
  xmlProc = require('./xmlProcessor'),
  path = require('path'),
  fs = require('fs'),
  unzip = require('unzip');

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

function initiateFeedParsing(file) {
  schemas.initSchemas(mongoose);

  connectMongo(config.mongoose.connectionString, startProcessing.bind(undefined, file));
};

function startProcessing(file) {
  var filePath = path.join(__dirname, file);
  xmlProc.processXml(schemas, file, path.basename(file, path.extname(file)), filePath);
/*
  switch (path.extname(file).toLowerCase()) {
    case '.xml':
      xmlProc.processXml(schemas, file, path.basename(file, path.extname(file)),
        filePath);
      break;
    case '.zip':
      console.log('Found zip file');
      fs.createReadStream(filePath)
        .pipe(unzip.Parse())
        .on('entry', processZipEntry.bind(undefined, filePath));
      break;
    case '':
      console.log('Found directory');
      process.exit();
      break;
    default:
      console.log('Unknown file type');
      process.exit();
      break;
  }
*/
}

function processZipEntry(filePath, entry) {
  switch (path.extname(entry.path).toLowerCase()) {
    case '.xml':
      xmlProc.processXml(schemas, filePath, path.basename(entry.path, path.extname(entry.path)), entry);
      break;
    case '.txt':
    case '.csv':
      break;
    default:
      entry.autodrain();
      break;
  }
}

if (process.argv.length > 2 && process.argv[2] != null) {
  initiateFeedParsing(process.argv[2]);
}
else {
  console.error("ERROR: insufficient arguments provided \n");

  console.log("Usage: node  <javascript_file_name>  <relative_xml_file_path>");
  console.log("");
  process.exit();
}
