var _path = require('path');
var dao = require('../dao/db');
var config = require('../config');
var schemas = require('../dao/schemas');
var feedIdMapper = require('../feedIdMapper');
var util = require('util');

var express = require('express');
var app = express();

// The child process module
var childProcess = require("child_process");

var fileQueue = [];
var fileProcessing = null;

// store the process ids and the feed ids they represent
var pIdsAndFeedIds = {};

var logger = (require('../logging/vip-winston')).Logger;
var NEWLINE = require('os').EOL;

/*
 * Handling the POST call after a file is uploaded.
 * This will queue up the file and start the processing of the file
 * if it's the first one in the queue.
 *
 */
function handleFileProcessing(req, res){

  if(req.body.filenames === undefined || (req.body.filenames).trim() === "" ){

    if ('development' == app.get('env')) {
      // in development

      logger.info("Received POST, however filename missing.");
      res.redirect('/');
    } else {
      // production

      // missing filename to process
      logger.info("Received POST, however filename missing.");
      res.send("Received POST, however filename missing.");
    }
  } else {

    // get any filenames to process
    var files = req.body.filenames.split(NEWLINE);

    for(var i=0; i<files.length; i++){

      var file = files[i];
      // remove any remnant of \r
      file = file.replace(/\r/g, '');

      file = file.trim();

      if(file.length > 0){
        // put the file at the end of the file queue
        fileQueue.push({ filename: file, s3Bucket: req.body.s3bucket });
      }
    }

    // if a file is processing, then do nothing since when that process ends or fails,
    // the file queue is checked for the next file to process, otherwise start to process the next file
    // and remove the file from the queue
    if(fileProcessing===null){

      fileProcessing = {};
      startFileProcessing(fileQueue.shift());
    }

    if ('development' == app.get('env')) {

      // in development
      // delaying responding back to the UI to allow the system to start processing so when we return, the Feed status
      // can be updated with the current feed being processed
      setTimeout(function(){
        res.redirect('/');
      }, 1000);

    } else {
      // production
      res.send(util.format("Received POST, filename(s): %s, s3 bucket: %s", req.body.filenames, req.body.s3bucket));
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
    logger.info('Starting to process: %s in S3 bucket: %s', processArgs[0], processArgs[1]);
  } else {
    processArgs.push(_path.join(_path.resolve(config.upload.uploadPath), fileInfo.filename));
    logger.info('Starting to process: ' + processArgs[0]);
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

        // **** *** ***
        // NOTE - Do not do any I/O / Asynchronous calls in this block
        // as the setting of the feedId into the pIdsAndFeedIds object needs
        // to occur before this node process ever executes the on('exit') function,
        // which is the case since node is single threaded, but this pattern would
        // break if there is a I/O blocking call in this code block

        // stringify the pid
        var pid = fileProcessing.pid + "";
        logger.info("Setting the pid: " + pid + " to match with feed " + msg.feedId);
        pIdsAndFeedIds[pid] = msg.feedId;

        // **** *** ***

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
    logger.info('Processing Exited: ' + code);

    // stringify the pid
    var pid = fileProcessing.pid + "";

    // if there was an error in the child process mark the feed as such
    // code 0 means everything was ok
    // any code other than 0 is an error
    if( (code!==0) && pIdsAndFeedIds[pid] != undefined ){

      var status = 'Errored';
      var statusReason = "";

      // bad feed file
      if(code===8){
        statusReason = " (Invalid Feed File)";
      } else if(code===5){
        statusReason = " (Out of Memory)";
      }


        schemas.models.feeds.update({_id: pIdsAndFeedIds[pid]}, { feedStatus: status + statusReason, complete: false, failed: true },
        function(err, feed) {
        }
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
    logger.info('Processing Closed: ' + code);
  });
  fileProcessing.on('error', function (code) {
    logger.info('Processing Errored: ' + code);
  });
}

function getFileQueue(){
  return fileQueue;
}

exports.getFileQueue = getFileQueue;
exports.handleFileProcessing = handleFileProcessing;
