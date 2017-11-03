var aws = require('./aws.js');
var conn = require('../dashboard/conn.js');
var util = require('../dashboard/util.js');
var logger = (require('../logging/vip-winston')).Logger;
var auth = require('../authentication/services.js');
var uuidv4 = require('uuid/v4');
var moment = require('moment');
var createCsvWriter = require('csv-writer').createObjectCsvWriter;
var tmp = require('tmp');
var fs = require('fs');

/**
 * exportElection starts a chain of loading data and then passing that
 * data into the next db function that loads more data. Once all the
 * data has been collected, it then calls compileFiles to create and
 * upload the actual data files.
 */
var exportElection = function(election_id, res) {
  util.simpleQueryCallback("SELECT id, state_fips, election_date FROM elections WHERE id = $1",
    [election_id],
    function(err, result) {
      if (err) {
        logger.error("Error querying for election");
        logger.error(err);
        res.writeHead(500, {'Content-Type': 'application/text'});
        res.write("Server Error");
        res.end();
      } else if (result.rows.length < 0) {
        logger.error("No Election with found with id: " + election_id);
        res.writeHead(404, {'Content-Type': 'application/text'});
        res.write("No election found");
        res.end();
      } else {
        getEarlyVoteSites(result.rows[0], res);
      }
    });
}

var getEarlyVoteSites = function(election, res) {
  var election_id = election["id"];
  util.simpleQueryCallback("SELECT id, type, name, address_1, address_2, address_3, " +
                           "city, state, zip, directions, voter_services FROM " +
                           "early_vote_sites WHERE election_id = $1",
    [election_id],
    function(err, result) {
      if (err) {
        logger.error("Error querying for early_vote_sites by election_id:" + election_id);
        logger.error(err);
        res.writeHead(500, {'Content-Type': 'application/text'});
        res.write("Server Error");
        res.end();
      } else {
        getSchedules(result.rows, election, res);
      }
    });
}

var getSchedules = function(earlyVoteSites, election, res) {
  var election_id = election["id"];
  util.simpleQueryCallback("SELECT id, start_date, end_date, start_time, end_time, " +
                           "timezone FROM schedules WHERE election_id = $1",
    [election_id],
    function(err, result) {
      if (err) {
        logger.error("Error querying for schedules by election_id:" + election_id);
        logger.error(err);
        res.writeHead(500, {'Content-Type': 'application/text'});
        res.write("Server Error");
        res.end();
      } else {
        getAssignments(result.rows, earlyVoteSites, election, res);
      }
    });
}

var getAssignments = function(schedules, earlyVoteSites, election, res) {
  var election_id = election["id"];
  util.simpleQueryCallback("SELECT id, early_vote_site_id, schedule_id FROM assignments " +
                           "WHERE early_vote_site_id in (select id from early_vote_sites where " +
                           "election_id = $1)",
    [election_id],
    function(err, result) {
      if (err) {
        logger.error("Error querying for assignments by election_id (through early_vote_sites):" + election_id);
        logger.error(err);
        res.writeHead(500, {'Content-Type': 'application/text'});
        res.write("Server Error");
        res.end();
      } else {
        compileFiles(result.rows, schedules, earlyVoteSites, election, res);
      }
    });
}

/**
 * Given an array of schedules, creates a map where the schedules are
 * keyed by id for easy lookup.
 */
var schedulesById = function(schedules) {
  var byId = {};
  schedules.forEach(function(schedule) {
    byId[schedule["id"]] = schedule;
  });
  return byId;
}

/**
 * Given an array of assignments, returns a map of early_vote_site_id to
 * array of schedule_ids that are assigned to the given earlyVoteSite.
 */
var earlyVoteSiteSchedules = function(assignments) {
  byEarlyVoteSiteId = {};
  assignments.forEach(function(assignment) {
    if(assignment["early_vote_site_id"] in byEarlyVoteSiteId) {
      byEarlyVoteSiteId[assignment["early_vote_site_id"]].push(assignment["schedule_id"]);
    } else {
      byEarlyVoteSiteId[assignment["early_vote_site_id"]] = [assignment["schedule_id"]];
    }
  });
  return byEarlyVoteSiteId;
};


/**
 * Formats an earlyVoteSite address into a single space delimited line
 * for ingestion into the Civic Info API format. Blank/nil elements will
 * be skipped.
 */
var formatEarlyVoteSiteAddress = function(earlyVoteSite){
  var addressComponents = []
  var address = [earlyVoteSite["address_1"],
                 earlyVoteSite["address_2"],
                 earlyVoteSite["address_3"],
                 earlyVoteSite["city"],
                 earlyVoteSite["state"],
                 earlyVoteSite["zip"]];
  address.forEach(function(val){
    if (val) { //checks for null, undefined, empty string
      addressComponents.push(val);
    }
  });
  return addressComponents.join(" ");
}

var pollingLocationFields = ["name","address_line","directions","hours","photo_uri",
                             "hours_open_id","is_drop_box","is_early_voting","latitude",
                             "longitude","latlng_source","id"];
/**
 * Converts an earlyVoteSite into a csv friendly format.
 * idGenerator is a function that will return a new ID with a unique suffix when
 * called. hoursOpenIf is an ID that will join the earlyVoteSite to all assigned
 * schedules.
 */
var earlyVoteSiteToCsv = function(earlyVoteSite, hoursOpenId, idGenerator) {
  return {
    "name": earlyVoteSite["name"],
    "address_line": formatEarlyVoteSiteAddress(earlyVoteSite),
    "directions": earlyVoteSite["directions"],
    "hours": "",
    "photo_uri": "",
    "hours_open_id": hoursOpenId,
    "is_drop_box": earlyVoteSite["type"] == "drop_box",
    "is_early_voting": earlyVoteSite["type"] == "early_vote_site",
    "latitude": "",
    "longitude": "",
    "latlng_source": "",
    "id": idGenerator("evs_pl_")
  }
}

var formatDate = function(date) {
  var asMoment = moment(date);
  return asMoment.format('YYYY-MM-DD');
}

var timezoneToOffset = {
  "EST": "-05:00",
  "EDT": "-04:00",
  "CST": "-06:00",
  "CDT": "-05:00",
  "MST": "-07:00",
  "MDT": "-06:00",
  "PST": "-08:00",
  "PDT": "-07:00",
  "AKST": "-09:00",
  "AKDT": "-08:00",
  "HST": "-11:00",
  "HDT": "-10:00"
}

var formatTime = function(time, timezone) {
  return time + timezoneToOffset[timezone];
}

var scheduleFields = ["start_time","end_time","is_only_by_appointment",
                      "is_or_by_appointment","is_subject_to_change",
                      "start_date","end_date","hours_open_id","id"];

/**
 * Converts a schedule into a CSV friendly format. idGenerator is a function
 * that will return an id with a unique suffix each time it's called. hoursOpenId
 * should match the hoursOpenId used for the earlyVoteSite to associate it with
 * this (and any other) schedules.
 */
var scheduleToCsv = function(schedule, hoursOpenId, idGenerator) {
  //TODO: format start/end time with TZ offsets when we add them to schedules
  return {
    "start_time": formatTime(schedule["start_time"], schedule["timezone"]),
    "end_time": formatTime(schedule["end_time"], schedule["timezone"]),
    "is_only_by_appointment": "",
    "is_or_by_appointment": "",
    "is_subject_to_change": "",
    "start_date": formatDate(schedule["start_date"]),
    "end_date": formatDate(schedule["end_date"]),
    "hours_open_id": hoursOpenId,
    "id": idGenerator("evs_sch_")
  }
}

var fieldsToHeaders = function(fields) {
  var headers = [];
  fields.forEach(function(val){
    headers.push({id: val, title: val});
  })
  return headers;
}

/**
 * Writes the data to a CSV file, using fields as the headers.
 * When it is done, calls the callback, the file will be complete,
 * and any actions that need to wait for the file to be written can
 * be activated in the callback, uploading a file or generating another
 * file, etc.
 */
var csvToFile = function(data, fields, file, callback) {
  var writer = createCsvWriter({
    path: file.name,
    header: fieldsToHeaders(fields)
  });
  writer.writeRecords(data)
        .then(() => { callback() });
}

/**
 * Constructs a temp file, fills in the CSV data, and then uploads the file
 * to S3. When it's done, will call the callback, and in this way we can upload
 * more than 1 file, and write the http response when we're all done.
 */
var buildAndSendFile = function(data, fields, election, filename, callback) {
  var tmpFile = tmp.fileSync();
  csvToFile(data, fields, tmpFile, function(){
    aws.uploadFile(tmpFile, filename, election, function() {
      tmpFile.removeCallback();
    });
  });
  callback();
}

/**
 * After the data has been retrieved from the database in a series of callbacks,
 * compileFiles does the work of converting the data to CSV friendly structures
 * and then creating and uploading the files to AWS.
 */
var compileFiles = function(assignments, schedules, earlyVoteSites, election, res) {
  //create an idGenerator function to ensure unique ids
  var idx = 0;
  var idGenerator = function(prefix) {
    return prefix + idx++;
  }

  var scheduleMap = schedulesById(schedules);
  var earlyVoteSchedulesMap = earlyVoteSiteSchedules(assignments);

  var earlyVoteSiteRows = [];
  var scheduleRows = [];

  //convert the DB data into CSV friendly format
  earlyVoteSites.forEach(function(site) {
    var hoursOpenId = idGenerator('evs_hours_');
    earlyVoteSiteRows.push(earlyVoteSiteToCsv(site, hoursOpenId, idGenerator));
    var schedules = earlyVoteSchedulesMap[site["id"]];
    if (schedules) {
      schedules.forEach(function(scheduleId) {
        var schedule = scheduleMap[scheduleId];
        scheduleRows.push(scheduleToCsv(schedule, hoursOpenId, idGenerator));
      });
    }
  });

  //construct and upload CSV files
  buildAndSendFile(scheduleRows, scheduleFields, election, "schedule.txt", function() {
    buildAndSendFile(earlyVoteSiteRows, pollingLocationFields, election, "polling_place.txt", function() {
      res.writeHead(200, {'Content-Type': 'application/text'});
      res.write("Files have been created and uploaded.");
      res.end();
    });
  });
}

var generate = function(req, res) {
  var election_id = req.params['electionid'];
  exportElection(election_id, res);
}

function registerFileGenerationServices(app) {
  app.post("/earlyvote/elections/:electionid/generate", generate);
}

exports.registerFileGenerationServices = registerFileGenerationServices;
