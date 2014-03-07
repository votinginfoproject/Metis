/**
 * Created by bantonides on 12/20/13.
 */
const
  config = require('../config'),
  mongoose = require('mongoose'),
  schemas = require('../dao/schemas'),
  xmlProc = require('./xmlProcessor'),
  vaveProc = require('./vaveProcessor')
  path = require('path'),
  fs = require('fs'),
  unzip = require('unzip');

function processFeed(filePath) {
  var db;
  var x = xmlProc();
  var vave = vaveProc();

  schemas.initSchemas(mongoose);

  connectMongo(config.mongoose.connectionString, startProcessing.bind(undefined, filePath));

  function connectMongo(connectionString, next) {
    mongoose.connect(connectionString);
    db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error: '));
    db.once('open', function callback() {
      console.log("initialized VIP database via Mongoose");
      next();
    });
  };

  function startProcessing(file) {
    var filePath = path.join(__dirname, file);
    fs.createReadStream(filePath)
      .pipe(unzip.Parse())
      .on('entry', processZipEntry);

  }

  function processZipEntry(entry) {
    switch (path.extname(entry.path).toLowerCase()) {
      case '.xml':
        x.processXml(schemas, filePath, path.basename(entry.path, path.extname(entry.path)), entry);
        break;
      case '.txt':
      case '.csv':
        vave.processCSV(schemas, filePath, entry);
        break;
      case '':
        console.log('Directory - ' + entry.path);
        break;
      default:
        entry.autodrain();
        break;
    }
  }
}

if (process.argv.length > 2 && process.argv[2] != null) {
  processFeed(process.argv[2]);
}
else {
  console.error("ERROR: insufficient arguments provided \n");

  console.log("Usage: node  <javascript_file_name>  <relative_xml_file_path>");
  console.log("");
  process.exit();
}
