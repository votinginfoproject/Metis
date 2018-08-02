var logger = (require('../logging/vip-winston')).Logger;
var auth = require('../authentication/services.js');
var util = require('../dashboard/util.js');
var conn = require('../dashboard/conn.js');

/**
 * Generates a function that takes a request and returns any/all fips codes for
 * the user in a vector.
 */
function fipsExtractor() {
	return function(req) {
		return auth.getUserFipsCodes(req);
	}
}

/**
 * Similar to `fipsExtractor`, only in will convert any user fips codes to just
 * the state level values, ie the first 2 values only.
 */
function stateFipsExtractor(){
	return function(req) {
		return auth.getUserFipsCodes(req).map(fips => fips.substring(0,2));
	}
}

/**
 * Similar to `fipsExtractor`, only if the user has a SuperAdmin role, it will
 * return 'super-admin' which will work with certain filtering queries that
 * will either load only items that match the fips OR all items for SuperAdmins.
 */
function adminFipsExtractor() {
	return function(req) {
		if (auth.isSuperAdmin(req)) {
			return ['super-admin']
		} else {
			return [auth.getUserFipsCodes(req)[0]]
		}
	}
}

/**
 * Validation function that expects a sqlCommand to run, params to run it with,
 * and a function to call when it passes and another to call if it fails. Success
 * for this function is that the SQL command returns at least 1 row.
 */
function simpleRowCheckValidation(sqlCommand, params, successFn, failureFn) {
	var callback = function(err, result) {
		if(err) {
			logger.error(err.name + ": " + err.message);
			failureFn();
		} else {
			if(result.rows.length > 0) {
				successFn();
			} else {
				failureFn();
			}
		}
	};

	conn.query(function(client) {
		client.query(sqlCommand, params, callback);
	});
}

/**
 * Same as `simpleRowCheckValidation` except it inverts the check and calls the successFn
 * only if there are no matching rows.
 */
 function invertedRowCheckValidation(sqlCommand, params, successFn, failureFn) {
 	var callback = function(err, result) {
 		if(err) {
 			logger.error(err.name + ": " + err.message);
 			failureFn();
 		} else {
 			if(result.rows.length = 0) {
 				successFn();
 			} else {
 				failureFn();
 			}
 		}
 	};

 	conn.query(function(client) {
 		client.query(sqlCommand, params, callback);
 	});
 }

var verifyElectionSql = `select * from elections where id = $1 AND state_fips in ($2);`
var verifyElectionParamFn = util.compoundParamExtractor([util.pathParamExtractor(['electionid']),
																								 		 		 stateFipsExtractor()]);
/**
 * Express middleware that checks if user is super admin or that the election
 * matches their state fips.
 */
function verifyElection(req, res, next) {
	if (auth.isSuperAdmin(req)) {
		next();
	} else {
		var params = verifyElectionParamFn(req);
		simpleRowCheckValidation(verifyElectionSql, params, next,
			function() {
				res.writeHead(403, {'Content-Type': 'text/plain'});
				res.end();
			});
	}
}

var verifyEVSElectionSql =
	`select * from elections e left join early_vote_sites evs on e.id = evs.election_id
 	 where evs.id = $1 AND e.state_fips in ($2);`
var verifyEVSParamFn = util.compoundParamExtractor([util.pathParamExtractor(['earlyvotesiteid']),
																			 						  stateFipsExtractor()]);
/**
 * Express middleware that checks if the user is super admin or that the early vote
 * site is associated to an election that matches the user's state fips.
 */
function verifyEVSElection(req, res, next) {
	if (auth.isSuperAdmin(req)) {
		next();
	} else {
		var params = verifyEVSParamFn(req);
		simpleRowCheckValidation(verifyEVSElectionSql, params, next,
			function() {
				res.writeHead(403, {'Content-Type': 'text/plain'});
				res.end();
			});
	}
}

var verifyEVSCountySql =
	`select * from early_vote_sites where id = $1 and county_fips in ($2);`
var verifyEVSCountyParamFn = util.compoundParamExtractor([util.pathParamExtractor(['earlyvotesiteid']),
																			 						  			fipsExtractor()]);
/**
 * Express middleware that checks if the user is super admin or state admin or that the early vote
 * site county fips matches the user's county fips.
 */
function verifyEVSCounty(req, res, next) {
	if (auth.isSuperAdmin(req) || auth.isStateAdmin(req)) {
		next();
	} else {
		var params = verifyEVSCountyParamFn(req);
		simpleRowCheckValidation(verifyEVSCountySql, params, next,
			function() {
				res.writeHead(403, {'Content-Type': 'text/plain'});
				res.end();
			});
	}
}

var verifyScheduleSql =
	`select * from elections e left join schedules s on e.id = s.election_id where s.id = $1 and e.state_fips in ($2);`
var verifyScheduleParamFn = util.compoundParamExtractor([util.pathParamExtractor(['scheduleid']),
																												 stateFipsExtractor()]);
 /**
  * Express middleware that checks if the user is super admin or that schedule is
	* associated to an election that matches the user's state fips
  */
function verifySchedule(req, res, next) {
	if (auth.isSuperAdmin(req)) {
		next();
	} else {
		var params = verifyScheduleParamFn(req);
		simpleRowCheckValidation(verifyScheduleSql, params, next,
			function() {
				res.writeHead(403, {'Content-Type': 'text/plain'});
				res.end();
			});
	}
}

var protectScheduleSql =
	`select * from early_vote_sites evs left join assignments as on evs.id = as.early_vote_site_id
	  join schedules s on as.schedule_id = s.id where s.id = $1 and evs.county_fips not in ($2);`
var protectScheduleParamFn = util.compoundParamExtractor([util.pathParamExtractor(['scheduleid']),
																													fipsExtractor()]);
/**
 * Express middleware that checks if the user is super admin or state admin or
 * that the schedule is not assigned to any early vote sites that don't match
 * the user's county fips.
 */
function protectSchedule(req, res, next) {
	if (auth.isSuperAdmin(req) || auth.isStateAdmin(req)) {
		next();
	} else {
		var params = protectScheduleParamFn(req);
		invertedRowCheckValidation(protectScheduleSql, params, next,
			function() {
				res.writeHead(403, {'Content-Type': 'text/plain'});
				res.end();
			});
	}
}

var verifyAssignmentStateSql =
	`select * from elections e left join schedules s on e.id = s.election_id
	 left join assignments as on s.id = as.schedule_id where as.id = $1 and e.state_fips in ($2);`
var verifyAssignmentStateParamFn = util.compoundParamExtractor([util.pathParamExtractor(['scheduleid']),
																												 				stateFipsExtractor()]);
var verifyAssignmentCountySql =
	`select * from early_vote_sites evs left join assignments as on evs.id = as.early_vote_site_id
	 where as.id = $1 and evs.county_fips in ($2);`
var verifyAssignmentCountyParamFn = util.compoundParamExtractor([util.pathParamExtractor(['scheduleid']),
																												 				fipsExtractor()]);
 /**
  * Express middleware that checks if the user is super admin or a state admin and
	* the assignment is associated to a matching state fips through schedules, or
	* that the assignment is associated to a matching county fips through early vote sites.
  */
function verifyAssignment(req, res, next) {
	if (auth.isSuperAdmin(req)) {
		next();
  } else if (auth.isStateAdmin(req)) {
		var params = verifyAssignmentStateParamFn(req);
		simpleRowCheckValidation(verifyAssignmentStateSql, params, next,
			function() {
				res.writeHead(403, {'Content-Type': 'text/plain'});
				res.end();
			});
	} else {
		var params = verifyAssignmentCountyParamFn(req);
		simpleRowCheckValidation(verifyAssignmentCountySql, params, next,
			function() {
				res.writeHead(403, {'Content-Type': 'text/plain'});
				res.end();
			});
	}
}


/**
 * Express middleware function that checks if the user is a SuperAdmin before letting
 * it continue. Otherwise a 403 error is returned to the response.
 */
function verifyAdmin(req, res, next) {
	if (auth.isSuperAdmin(req)) {
		next();
	} else {
		res.writeHead(403, {'Content-Type': 'text/plain'});
		res.end();
	}
}

module.exports = {
	fipsExtractor: fipsExtractor,
	adminFipsExtractor: adminFipsExtractor,
	verifyAdmin: verifyAdmin,
	verifyElection: verifyElection,
	verifyEVSElection: verifyEVSElection,
	verifyEVSCounty: verifyEVSCounty,
	verifySchedule: verifySchedule,
	protectSchedule: protectSchedule,
	verifyAssignment: verifyAssignment
}
