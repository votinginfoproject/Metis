var _path = require('path');
var dao = require('../dao/db');
var config = require('../config');
var mapper = require('./mappers/feed');
var schemas = require('../dao/schemas');

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
    res.send("Received POST, filename: " + req.body.filename);

    // put the file at the end of the file queue
    fileQueue.push(req.body.filename);

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
function startFileProcessing(filename){

  var uploadFolderPath = config.upload.uploadPath;

  // need to make sure the path is surrounded by slashes as the path will be relative to the current folder
  if(uploadFolderPath.charAt(0)!="/"){
    uploadFolderPath = "/" + uploadFolderPath;
  }
  if(uploadFolderPath.charAt(uploadFolderPath.length-1)!="/"){
    uploadFolderPath = uploadFolderPath + "/";
  }
  // now make the path relative to the root folder
  uploadFolderPath = ".." + uploadFolderPath;

  // Forking a whole new instance of v8
  // .fork() is similar to .spawn() however it also gives the child the ability to send messages to the parent
  // 30ms startup time and minimum 10MB for each new child process
  fileProcessing = childProcess.fork("feed-processor/processor.js", [uploadFolderPath + filename]);

  // when child sends messages
  fileProcessing.on('message', function(msg){

    // if the message contains a feedid
    // store this feedid with the pid of the child process so if later
    // the child process errors, we can set the failed flag for the feed in mongo
    if(msg.feedid){

      // stringify the pid
      var pid = fileProcessing.pid + "";

      console.log("Setting the pid: " + pid + " to match with feed " + msg.feedid);

      pIdsAndFeedIds[pid] = msg.feedid;
    }

  }.bind(this))

  // when child shuts down
  fileProcessing.on('exit', function (code) {
    console.log('Processing Exited: ' + code);

    // stringify the pid
    var pid = fileProcessing.pid + "";

    // if there was an error in the child process mark the feed as such
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
}

exports.handleFileProcessing = handleFileProcessing;
