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
  unzip = require('unzip'),
  AWS = require('aws-sdk');

function processFeed(filePath, s3Bucket) {
  var db;
  var x = xmlProc();
  var vave = vaveProc();

  var consolidationRequired = false;

  schemas.initSchemas(mongoose);

  connectMongo(config.mongoose.connectionString, startProcessing.bind(undefined, filePath, s3Bucket));

  function connectMongo(connectionString, next) {
    mongoose.connect(connectionString);
    db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error: '));
    db.once('open', function callback() {
      console.log("initialized VIP database via Mongoose");
      next();
    });
  };

  function startProcessing(file, s3Bucket) {
    var ext = path.extname(file);
    var feedStream;

    if (config.importer.useS3) {
      AWS.config.accessKeyId = config.importer.s3AccessKeyId;
      AWS.config.secretAccessKey = config.importer.s3SecretAccessKey;
      AWS.config.region = config.importer.s3Region;

      var s3 = new AWS.S3();
      var params = {Bucket: s3Bucket, Key: file};
      feedStream = s3.getObject(params).createReadStream();
    } else {
      if (!fs.existsSync(file)) {
        console.error('File "' + file + '" not found.');
        exitProcess(1);
      }
      feedStream = fs.createReadStream(file);
    }

      // if file exists
      switch (ext.toLowerCase()) {
        case '.zip':
          feedStream
            .pipe(unzip.Parse())
            .on('entry', processZipEntry)
            .on('close', finishZipProcessing);
          break;
        case '.xml':
          x.processXml(schemas, filePath, path.basename(file, ext), feedStream);
          break;
        default:
          console.error('Filetype %s is not currently supported.', ext)
          exitProcess(1);
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
  processFeed(process.argv[2], process.argv[3]);
}
else {
  console.error("ERROR: insufficient arguments provided to processor.js\n");

  console.log("Usage: node  <javascript_file_name>  <relative_xml_file_path>");
  console.log("");

  exitProcess(1);
}

function exitProcess(code){

  // now close out the mongoose connection and exit the process
  mongoose.disconnect();
  process.exit(code);
}