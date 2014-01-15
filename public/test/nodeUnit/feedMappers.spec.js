/**
 * Created by rcartier13 on 1/15/14.
 */

var mappers = require('../../../services/mappers/feed');
var data = require('./mockedModels');
var moment = require('moment');
var nodeUtil = require('./nodeUtil');

describe('Feed Mappers Tests', function() {

  describe('mapFeed Test', function() {
    it('returns the data', function() {
      var feed = data.feed;
      var res = mappers.mapFeed('path', feed);
      expect(res.id).toBe(feed.id);
      expect(res.date).toBe(moment(feed._election.date).utc().format('YYYY-MM-DD'));
      expect(res.state).toBe(feed._state.name);
      expect(res.type).toBe(feed._election.electionType);
      expect(res.status).toBe(feed.feedStatus);
      expect(res.name).toBe(feed.name);
    });
  });

  describe('mapOverview Test', function() {
    it('returns the data', function() {
      var feed = data.feed;
      var res = mappers.mapFeedOverview('path', feed);
      expect(res.id).toBe(feed.id);
      expect(res.title).toBe(feed.name);
    });
  });

  describe('mapSource Test', function() {
    it('returns the data', function() {
      var source = data.source;
      var res = mappers.mapSource('path', source);
      expect(res.id).toBe(source.elementId);
      expect(res.source_info.name).toBe(source.name);
      expect(res.source_info.date).toBe(moment(source.datetime).utc().format('YYYY-MM-DD'));
      expect(res.source_info.description).toBe(source.description);
      expect(res.source_info.org_url).toBe(source.organizationUrl);
      expect(res.source_info.tou_url).toBe(source.touUrl);
      expect(res.feed_contact.name).toBe(source._feedContact.name);
      expect(res.feed_contact.phone).toBe(source._feedContact.phone);
      expect(res.feed_contact.title).toBe(source._feedContact.title);
      expect(res.feed_contact.fax).toBe(source._feedContact.fax);
      expect(res.feed_contact.email).toBe(source._feedContact.email);
    });
  });

  describe('mapElection Test', function() {
    it('returns the data', function() {
      var election = data.election;
      var res = mappers.mapElection('path', election);
      expect(res.id).toBe(election.elementId);
      expect(res.date).toBe(moment(election.date).utc().format('YYYY-MM-DD'));
      expect(res.type).toBe(election.electionType);
      expect(res.statewide).toBe(election.statewide);
      expect(res.registration_url).toBe(election.registrationInfo);
      expect(res.absentee_url).toBe(election.absenteeBallotInfo);
      expect(res.results_url).toBe(election.resultsUrl);
      expect(res.polling_hours).toBe(election.pollingHours);
      expect(res.day_of_registration).toBe(election.electionDayRegistration);
      expect(res.registration_deadline).toBe(moment(election.registrationDeadLine).utc().format('YYYY-MM-DD'));
      expect(res.absentee_deadline).toBe(moment(election.absenteeRequestDeadline).utc().format('YYYY-MM-DD'));
      expect(res.state.id).toBe(election.stateId);
      expect(res.state.name).toBe(election._state.name);
      expect(res.state.locality_count).toBe(election._state.localityCount);
    });
  });

  describe('mapState Test', function() {
    it('returns the data', function() {
      var state = data.state;
      var res = mappers.mapState('path', state);
      expect(res.id).toBe(state.elementId);
      expect(res.name).toBe(state.name);
      nodeUtil.testElectionAdmin(res.administration, state._electionAdministration);
    });
  });

  describe('mapLocality Test', function() {
    it('returns the data', function() {
      var locality = data.locality;
      var res = mappers.mapLocality('path', locality);
      expect(res.id).toBe(locality.elementId);
      expect(res.name).toBe(locality.name);
      expect(res.type).toBe(locality.type);
      nodeUtil.testElectionAdmin(res.administration, locality._electionAdministration);
    });
  });

  describe('mapEarlyVoteSites', function() {
    it('returns the data', function() {
      var res = mappers.mapEarlyVoteSites('path', data.mapFunc);
      nodeUtil.testElectionAdmin(res, data.mapFunc.data);
    });
  });

  describe('mapLocalityPrecinct Test', function() {
    it('returns the data', function() {
      var locality = data.locality;
      data.mapFunc.map = function (callback) {
        return callback(locality);
      }
      var res = mappers.mapLocalityPrecincts('path', data.mapFunc);
      expect(res.id).toBe(locality.elementId);
      expect(res.name).toBe(locality.name);
      expect(res.precinct_splits).toBe(locality._precinctSplits.length);
    });
  });

  describe('mapLocalities Test', function() {
    it('returns the data', function() {
      var locality = data.locality;
      data.mapFunc.map = function (callback) {
        return callback(locality);
      }
      var res = mappers.mapLocalities('path', data.mapFunc);
      expect(res.id).toBe(locality.elementId);
      expect(res.name).toBe(locality.name);
      expect(res.type).toBe(locality.type);
      expect(res.precincts).toBe(locality._precincts.length);
    });
  });

  describe('mapPrecinct Test', function() {
    it('returns the data', function() {
      var precinct = data.precinct;
      var res = mappers.mapPrecinct('path', precinct);
      expect(res.id).toBe(precinct.elementId);
      expect(res.name).toBe(precinct.name);
      expect(res.number).toBe(precinct.number);
      expect(res.ward).toBe(precinct.ward);
      expect(res.mailonly).toBe(precinct.mailOnly);
      expect(res.ballotimage).toBe(precinct.ballotStyleImageUrl);
      expect(res.streetsegments.total).toBe(precinct._streetSegments.length);
    });
  });

  describe('mapElectoralDistricts Test', function() {
    it('returns the data', function() {
      var electoral = data.electoralDistrict;
      data.mapFunc.map = function(callback) {
        return callback(electoral);
      };
      var res = mappers.mapElectoralDistricts('path', data.mapFunc);
      expect(res.id).toBe(electoral.elementId);
      expect(res.name).toBe(electoral.name);
      expect(res.type).toBe(electoral.type);
      expect(res.number).toBe(electoral.number);
    });
  });

  describe('mapPollingLocations Test', function() {
    it('returns the data', function() {
      var electoral = data.mapFunc;
     electoral.map = function(callback) {
        return callback(electoral.data);
      };
      var res = mappers.mapPollingLocations('path', data.mapFunc);
      nodeUtil.testElectionAdmin(res, data.mapFunc.data);
    });
  });

  describe('mapPrecinctPrecinctSplits Test', function() {
    it('returns the data', function() {
      var precinct = data.precinct;
      data.mapFunc.map = function(callback) {
        return callback(precinct);
      };
      var res = mappers.mapPrecinctPrecinctSplits('path', data.mapFunc);
      expect(res.id).toBe(precinct.elementId);
      expect(res.name).toBe(precinct.name);
      expect(res.street_segments).toBe(precinct._streetSegments.length);
    });
  });

  describe('mapElectionContest', function() {
    it('returns the data', function() {
      var contest = data.contest;
      var res = mappers.mapElectionContest('path', contest);
      expect(res.id).toBe(contest.elementId);
      expect(res.type).toBe(contest.type);
      expect(res.title).toBe(contest.office);
    });
  });
});
