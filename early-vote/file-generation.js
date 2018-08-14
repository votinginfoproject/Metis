var aws = require('./aws.js');
var conn = require('../dashboard/conn.js');
var util = require('../dashboard/util.js');
var access = require('./access.js');
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
  util.simpleQueryCallback("SELECT id, county_fips, type, name, address_1, address_2, address_3, " +
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
var schedulesById =
  (schedules) =>
    schedules.reduce((accumulator, schedule) =>
                      {accumulator[schedule["id"]] = schedule;
                       return accumulator},
                     {});

/**
 * Given an array of assignments, returns a map of early_vote_site_id to
 * array of schedule_ids that are assigned to the given earlyVoteSite.
 */
var earlyVoteSiteSchedules =
  (assignments) =>
    assignments.reduce((accumulator, assignment) =>
                        {if(assignment["early_vote_site_id"] in accumulator) {
                           accumulator[assignment["early_vote_site_id"]].push(assignment["schedule_id"]);
                           return accumulator;
                         } else {
                           accumulator[assignment["early_vote_site_id"]] = [assignment["schedule_id"]];
                           return accumulator;
                         }},
                       {});

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
  return address.filter((val) => {if(val) {return true;} else {return false}}).join(" ");
}

var pollingLocationFields = ["name","address_line","directions","hours","photo_uri",
                             "hours_open_id","is_drop_box","is_early_voting","latitude",
                             "longitude","latlng_source","id","county_fips"];
/**
 * Converts an earlyVoteSite into a csv friendly format.
 * idGenerator is a function that will return a new ID with a unique suffix when
 * called. hoursOpenIf is an ID that will join the earlyVoteSite to all assigned
 * schedules.
 */
var earlyVoteSiteToCsv = (earlyVoteSite, hoursOpenId, idGenerator) =>
  ({
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
    "id": idGenerator("evs_pl_"),
		"county_fips": earlyVoteSite["county_fips"]
  });

var formatDate = (date) => {return moment(date).format('YYYY-MM-DD')};

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
var scheduleToCsv = (schedule, hoursOpenId, idGenerator) =>
  ({"start_time": formatTime(schedule["start_time"], schedule["timezone"]),
    "end_time": formatTime(schedule["end_time"], schedule["timezone"]),
    "is_only_by_appointment": "",
    "is_or_by_appointment": "",
    "is_subject_to_change": "",
    "start_date": formatDate(schedule["start_date"]),
    "end_date": formatDate(schedule["end_date"]),
    "hours_open_id": hoursOpenId,
    "id": idGenerator("evs_sch_")});

var fieldsToHeaders = (fields) => fields.map((val) => ({id: val, title: val}));

/**
 * Takes a date and formats it like Month Day, i.e. March 9. Date could be a date
 * object or date parsable string, anything moment can convert natively.
 */
var formatDateV3 = (date) => {return moment(date).format('MMMM D')};

/**
 * Returns a human readable string of the date(s) of this schedule.
 * If start and end dates are the same, just returns that date in a human
 * readable format, otherwise puts a " to " between them.
 * E.G.
 * March 19
 * March 20 to March 24
 */
var scheduleToDates = function(schedule) {
  if (schedule["start_date"] == schedule["end_date"]) {
    return formatDateV3(schedule["start_date"]);
  } else {
    var dateString = formatDateV3(schedule["start_date"]);
    dateString += " to ";
    dateString += formatDateV3(schedule["end_date"]);
    return dateString;
  }
}

/**
 * Takes a time in "10:30:00" and puts out "10:30am",
 * or "14:00:00" and puts out "2pm".
 */
var formatTimeV3 = function(timeString) {
  var timeParts = timeString.split(":");
  var hours = parseInt(timeParts[0]);
  var minutes = parseInt(timeParts[1]);
  var meridiem = "am";
  if (hours > 12) {
    meridiem = "pm";
    hours -= 12;
  }
  var timeString = "" + hours;
  if(minutes > 0) {
    timeString += ":" + timeParts[1];
  }
  timeString += meridiem;
  return timeString;
}

/**
 * Formats a days_times_open string for the given schedule, prefixing
 * the date(s) only if includeDate is set to true.
 * Example outputs would look like:
 * 8am to 4pm (includeDate false)
 * March 9, 8:45am to 5pm.
 * March 20 to March 25, 8am to 4pm.
 */
var scheduleToDaysTimesOpen = function(schedule, includeDate) {
  var str = "";
  if (includeDate) {
    str += scheduleToDates(schedule) + ", ";
  }
  str += formatTimeV3(schedule["start_time"]) + " to ";
  str += formatTimeV3(schedule["end_time"]);
  return str;
}

/**
 * Given schedules, figures out the earliest start and latest end dates.
 */
var findStartAndEndDates = function(schedules) {
  var startDates = schedules.map(s => moment(s["start_date"]));
  var endDates = schedules.map(s => moment(s["end_date"]));
  return {"start": moment.min(startDates),
          "end": moment.max(endDates)};
}

/**
 * Compares two schedules based on their start dates.
 */
var startDateComparator = function(a, b) {
  var aMoment = moment(a["start_date"]);
  var bMoment = moment(b["start_date"]);
  if (aMoment.isBefore(bMoment)) {
    return -1;
  } else if (aMoment.isSame(bMoment)) {
    return 0;
  } else {
    return 1;
  }
}

/**
 * Creates a string of the days and times open for all the schedules,
 * including the dates since this is intended for use when there are more than 1
 * schedules. Will sort the schedules by start date first.
 */
var schedulesToDaysTimesOpenString = function(schedules) {
  schedules.sort(startDateComparator);

  var reducer = (a, s) => a + scheduleToDaysTimesOpen(s, true) + ". ";

  return schedules.reduce(reducer, "").trim();
}

/**
 * Given 0, 1 or more schedules, we need to generate a start date, end date, and
 * a text description of hours open. If there's a single schedule, it's simple,
 * if there are more, start and end dates have to be computed as min and max, and
 * hours open has to be a list of dates + times.
 */
var schedulesToV3 = function(schedules) {
  if (schedules.length == 0) {
    return {"start_date": "",
            "end_date": "",
            "days_times_open": ""};
  } else if(schedules.length == 1) {
    return {"start_date": formatDate(schedules[0]["start_date"]),
            "end_date": formatDate(schedules[0]["end_date"]),
            "days_times_open": scheduleToDaysTimesOpen(schedules[0], false)};
  } else {

    var startEnd = findStartAndEndDates(schedules);
    var daysTimesOpenString = schedulesToDaysTimesOpenString(schedules);

    return {"start_date": formatDate(startEnd["start"]),
            "end_date": formatDate(startEnd["end"]),
            "days_times_open": daysTimesOpenString};
  }
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 */
var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var earlyVoteSiteFields = ["name","address_location_name","address_line1",
  "address_line2","address_line3","address_city","address_state","address_zip",
  "directions","voter_services","start_date","end_date","days_times_open","id","county_fips"];

/**
 * Given an Early Vote Site and 1 or more schedules, generates a CSV compatible
 * hash with all the fields needed for a 3.0 early_vote_site file.
 */
var earlyVoteSiteAndSchedulesToCsv = function(earlyVoteSite, schedules, idGenerator) {
  var v3Schedule = schedulesToV3(schedules);
  var idPrefix = earlyVoteSite["county_fips"] + getRandomInt(10000,99999);
  return {"name": "",
          "address_location_name": earlyVoteSite["name"],
          "address_line1": earlyVoteSite["address_1"],
          "address_line2": earlyVoteSite["address_2"],
          "address_line3": earlyVoteSite["address_3"],
          "address_city": earlyVoteSite["city"],
          "address_state": earlyVoteSite["state"],
          "address_zip": earlyVoteSite["zip"],
          "directions": earlyVoteSite["directions"],
          "voter_services": earlyVoteSite["voter_services"],
          "start_date": v3Schedule["start_date"],
          "end_date": v3Schedule["end_date"],
          "days_times_open": v3Schedule["days_times_open"],
          "id": idGenerator(idPrefix),
					"county_fips": earlyVoteSite["county_fips"]};
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
  var v3Rows = [];

  //convert the DB data into CSV friendly format
  earlyVoteSites.forEach(function(site) {
    var hoursOpenId = idGenerator('evs_hours_');
    earlyVoteSiteRows.push(earlyVoteSiteToCsv(site, hoursOpenId, idGenerator));
    var scheduleIds = earlyVoteSchedulesMap[site["id"]];
    if (scheduleIds) {
      var schedules = [];
      scheduleIds.forEach(function(scheduleId) {
        var schedule = scheduleMap[scheduleId];
        schedules.push(schedule);
        scheduleRows.push(scheduleToCsv(schedule, hoursOpenId, idGenerator));
      });
      v3Rows.push(earlyVoteSiteAndSchedulesToCsv(site, schedules, idGenerator));
    } else {
      v3Rows.push(earlyVoteSiteAndSchedulesToCsv(site, [], idGenerator));
    }
  });

  //construct and upload CSV files
  buildAndSendFile(scheduleRows, scheduleFields, election, "schedule.txt", function() {
    buildAndSendFile(earlyVoteSiteRows, pollingLocationFields, election, "polling_place.txt", function() {
      buildAndSendFile(v3Rows, earlyVoteSiteFields, election, "early_vote_site.txt", function() {
        res.writeHead(200, {'Content-Type': 'application/text'});
        res.write("Files have been created and uploaded.");
        res.end();
      });
    });
  });
}

var generate = function(req, res) {
  var election_id = req.params['electionid'];
  exportElection(election_id, res);
}

function registerFileGenerationServices(app) {
  app.post("/earlyvote/elections/:electionid/generate", access.verifyAdmin, generate);
}

exports.registerFileGenerationServices = registerFileGenerationServices;
