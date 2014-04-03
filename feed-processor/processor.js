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

  var consolidationRequired = false;

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
    var filePath = file;
    var ext = path.extname(file);

    if (fs.existsSync(filePath)) {
      // if file exists
      switch (ext.toLowerCase()) {
        case '.zip':
          fs.createReadStream(filePath)
            .pipe(unzip.Parse())
            .on('entry', processZipEntry)
            .on('close', finishZipProcessing);
          break;
        case '.xml':
          x.processXml(schemas, filePath, path.basename(file, ext), fs.createReadStream(filePath));
          break;
        default:
          console.error('Filetype %s is not currently supported.', ext)
          exitProcess();
      }
    } else {
      // if file doesn't exist
      console.error('File "' + filePath + '" not found.')
      exitProcess();
    }

  }

  function processZipEntry(entry) {
    switch (path.extname(entry.path).toLowerCase()) {
      case '.xml':
        x.processXml(schemas, filePath, path.basename(entry.path, path.extname(entry.path)), entry);
        break;
      case '.txt':
      case '.csv':
        consolidationRequired = true;  //if we see any flat files then we need to consolidate the data
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

  function finishZipProcessing() {
    //This is only required if we processed flat files.  XML data is already consolidated.
    if (consolidationRequired) {
      vave.consolidateFeedData();
    }
  }
}

if (process.argv.length > 2 && process.argv[2] != null) {
  processFeed(process.argv[2]);
}
else {
  console.error("ERROR: insufficient arguments provided to processor.js\n");

  console.log("Usage: node  <javascript_file_name>  <relative_xml_file_path>");
  console.log("");

  exitProcess();
}

function exitProcess(){

  // now close out the mongoose connection and exit the process
  mongoose.disconnect();
  process.exit();
}