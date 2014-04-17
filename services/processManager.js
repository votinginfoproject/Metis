var _path = require('path');
var dao = require('../dao/db');
var config = require('../config');
var schemas = require('../dao/schemas');
var feedIdMapper = require('../feedIdMapper');
var util = require('util');

// The child process module
var childProcess = require("child_process");

var fileQueue = [];
var fileProcessing = null;

// store the process ids and the feed ids they represent
var pIdsAndFeedIds = {};

/*
 * Handling the POST call after a file is uploaded.
 * This will queue up the file and start the processing of the file
 * if it's the first one in the queue.
 *
 */
function handleFileProcessing(req, res){

  if(req.body.filename === undefined || (req.body.filename).trim() === "" ){

    // missing filename to process
    res.send("Received POST, however filename missing.");
  } else {

    // have a filename to process
    res.send(util.format("Received POST, filename: %s, s3 bucket: %s", req.body.filename, req.body.s3bucket));

    // put the file at the end of the file queue
    fileQueue.push({ filename: req.body.filename, s3Bucket: req.body.s3bucket });

    // if a file is processing, then do nothing since when that process ends or fails,
    // the file queue is checked for the next file to process, otherwise start to process the next file
    // and remove the file from the queue
    if(fileProcessing===null){

      fileProcessing = {};
      startFileProcessing(fileQueue.shift());
    }

  }
}

/*
 * Start the process a file
 *
 * @param filename - the file to process
 *
 */
function startFileProcessing(fileInfo){

  var processArgs = [];

  if (config.importer.useS3) {
    processArgs.push(fileInfo.filename);
    processArgs.push(fileInfo.s3Bucket);
    console.log('Starting to process: %s in S3 bucket: %s', processArgs[0], processArgs[1]);
  } else {
  processArgs.push(_path.join(_path.resolve(config.upload.uploadPath), fileInfo.filename));
  console.log('Starting to process: ' + processArgs[0]);
  }

  // Forking a whole new instance of v8
  // .fork() is similar to .spawn() however it also gives the child the ability to send messages to the parent
  // 30ms startup time and minimum 10MB for each new child process
  fileProcessing = childProcess.fork("feed-processor/processor.js", processArgs);

  // when child sends messages
  fileProcessing.on('message', function(msg){

    // following a simple pattern of sending messages from the child using a specific messageId
    if(msg.messageId){

      // if the message contains a feedid
      // store this feedid with the pid of the child process so if later
      // the child process errors, we can set the failed flag for the feed in mongo
      if(msg.messageId==1){
        // stringify the pid
        var pid = fileProcessing.pid + "";

        console.log("Setting the pid: " + pid + " to match with feed " + msg.feedId);

        pIdsAndFeedIds[pid] = msg.feedId;
      }

      // message with feedid and friendlyfeedid of the feed the child is processing
      if(msg.messageId==2){

        // add the friendly id to the list of ids loaded into memory
        feedIdMapper.addToUserFriendlyIdMap(msg.friendlyId, msg.feedId);
      }
    }

  }.bind(this))

  // when child shuts down
  fileProcessing.on('exit', function (code) {
    console.log('Processing Exited: ' + code);

    // stringify the pid
    var pid = fileProcessing.pid + "";

    // if there was an error in the child process mark the feed as such
    // code 0 means everything was ok
    // any code below 0 is our own code for things that go wrong, so we won't check those as if we are
    // setting the codes for exit, we will also update the status of the feed at that point in time
    if(code>0 && pIdsAndFeedIds[pid] != undefined ){

      schemas.models.Feed.update({_id: pIdsAndFeedIds[pid]}, { feedStatus: 'Errored', complete: false, failed: true },
        function(err, feed) {}
      );
    }

    // remove the pid entry as we no longer need it
    delete pIdsAndFeedIds[pid];

    // process the next file in the queue
    if(fileQueue.length>0){
      startFileProcessing(fileQueue.shift());
    } else {
      // nothing more to process right now so reset the fileProcessing
      fileProcessing = null;
    }

  });
  fileProcessing.on('close', function (code) {
    console.log('Processing Closed: ' + code);
  });
  fileProcessing.on('error', function (code) {
    console.log('Processing Errored: ' + code);
  });
}

exports.handleFileProcessing = handleFileProcessing;
