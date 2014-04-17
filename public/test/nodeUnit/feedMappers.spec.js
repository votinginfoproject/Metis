/**
 * Created by rcartier13 on 1/15/14.
 */

var mappers = require('../../../services/mappers/feed');
var data = require('./mockedMapData');
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
      expect(res.feed_name).toBe(feed.name);
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

  describe('mapElectionContest Test', function() {
    it('returns the data', function() {
      var contest = data.contest;
      var res = mappers.mapElectionContest('path', contest);
      expect(res.id).toBe(contest.elementId);
      expect(res.type).toBe(contest.type);
      expect(res.title).toBe(contest.office);
    });
  });

  describe('mapStreetSegments Test', function() {
    it('returns the data', function() {
      var street = data.streetSegments;
      data.mapFunc.map = function(callback) {
        return callback(street);
      };
      var res = mappers.mapStreetSegments('path', data.mapFunc);

      expect(res.id).toBe(street.elementId);
      expect(res.start_house_number).toBe(street.startHouseNumber);
      expect(res.end_house_number).toBe(street.endHouseNumber);
      expect(res.odd_even).toBe(street.oddEvenBoth);
      expect(res.address.house_number).toBe(street.nonHouseAddress.houseNumber);
      expect(res.address.house_number_prefix).toBe(street.nonHouseAddress.houseNumberPrefix);
      expect(res.address.house_number_suffix).toBe(street.nonHouseAddress.houseNumberSuffix);
      expect(res.address.street_direction).toBe(street.nonHouseAddress.streetDirection);
      expect(res.address.street_name).toBe(street.nonHouseAddress.streetName);
      expect(res.address.street_suffix).toBe(street.nonHouseAddress.streetSuffix);
      expect(res.address.address_direction).toBe(street.nonHouseAddress.addressDirection);
      expect(res.address.apartment).toBe(street.nonHouseAddress.apartment);
      expect(res.address.city).toBe(street.nonHouseAddress.city);
      expect(res.address.state).toBe(street.nonHouseAddress.state);
      expect(res.address.zip).toBe(street.nonHouseAddress.zip);
    });
  });

  describe('mapPrecinctSplit Test', function() {
    it('returns the data', function() {
      var precinct = data.precinct;
      var res = mappers.mapPrecinctSplit('path', precinct);
      expect(res.id).toBe(precinct.elementId);
      expect(res.name).toBe(precinct.name);
      expect(res.street_segments.total).toBe(precinct._streetSegments.length);
    });
  });

  describe('mapEarlyVoteSites Test', function() {
    it('returns the data', function() {
      var earlyVote = data.earlyVote;
      var res = mappers.mapEarlyVoteSite('', earlyVote);
      expect(res.id).toBe(earlyVote.elementId);
      expect(res.name).toBe(earlyVote.name);
      expect(res.address.location_name).toBe(earlyVote.address.location_name);
      expect(res.address.line1).toBe(earlyVote.address.line1);
      expect(res.address.line2).toBe(earlyVote.address.line2);
      expect(res.address.line3).toBe(earlyVote.address.line3);
      expect(res.address.city).toBe(earlyVote.address.city);
      expect(res.address.state).toBe(earlyVote.address.state);
      expect(res.address.zip).toBe(earlyVote.address.zip);
      expect(res.directions).toBe(earlyVote.directions);
      expect(res.voter_services).toBe(earlyVote.voterServices);
      expect(res.start_date).toBe(earlyVote.startDate);
      expect(res.end_date).toBe(earlyVote.endDate);
      expect(res.days_times_open).toBe(earlyVote.daysTimesOpen);
    });
  });

  describe('mapElectionAdministration Test', function() {
    it('returns the data', function() {
      var admin = data.electionAdmin;
      var res = mappers.mapElectionAdministration('', admin);
      expect(res.id).toBe(admin.elementId);
      expect(res.name).toBe(admin.name);
      nodeUtil.testMapperAddress(res.physical_address, admin.physicalAddress);
      nodeUtil.testMapperAddress(res.mailing_address, admin.mailingAddress);
      expect(res.elections_url).toBe(admin.electionsUrl);
      expect(res.registration_url).toBe(admin.registrationUrl);
      expect(res.am_i_registered_url).toBe(admin.amIRegisteredUrl);
      expect(res.absentee_url).toBe(admin.absenteeUrl);
      expect(res.where_do_i_vote_url).toBe(admin.whereDoIVoteUrl);
      expect(res.rules_url).toBe(admin.rulesUrl);
      expect(res.voter_services).toBe(admin.voterServices);
      nodeUtil.testElectionOfficial(res.election_official, admin._electionOfficial);
      nodeUtil.testElectionOfficial(res.overseas_voter_contact, admin._overseasVoterContact);
      expect(res.hours).toBe(admin.hours);
    });
  });

  describe('mapContest Test', function() {
    it('returns the data', function() {
      var contest = data.electionContest;
      var res = mappers.mapContest('path', contest);
      expect(res.id).toBe(contest.elementId);
      expect(res.type).toBe(contest.type);
      expect(res.partisan).toBe(contest.partisan);
      expect(res.primary_party).toBe(contest.primaryParty);
      expect(res.electorate_specifications).toBe(contest.electorateSpecifications);
      expect(res.special).toBe(contest.special);
      expect(res.office).toBe(contest.office);
      expect(res.filing_closed_date).toBe(moment(contest.filingClosedDate).utc().format('YYYY-MM-DD'));
      expect(res.number_elected).toBe(contest.numberElected);
      expect(res.number_voting_for).toBe(contest.numberVotingFor);
      expect(res.ballot_placement).toBe(contest.ballotPlacement);
      expect(res.ballot.id).toBe(contest._ballot.elementId);
      expect(res.ballot.candidate_count).toBe(contest._ballot.candidates.length);
      expect(res.ballot.referendum_count).toBe(contest._ballot.referendumIds.length);
      expect(res.electoral_district.id).toBe(contest._electoralDistrict.elementId);
      expect(res.electoral_district.name).toBe(contest._electoralDistrict.name);
      expect(res.electoral_district.precincts).toBe(contest._electoralDistrict._precincts.length);
      expect(res.electoral_district.precinct_splits).toBe(contest._electoralDistrict._precinctSplits.length);
      expect(res.contest_result.id).toBe(contest._contestResult.elementId);
      expect(res.contest_result.votes).toBe(contest._contestResult.totalVotes);
      expect(res.contest_result.valid_votes).toBe(contest._contestResult.totalValidVotes);
      expect(res.contest_result.overvotes).toBe(contest._contestResult.overvotes);
      expect(res.contest_result.blank_votes).toBe(contest._contestResult.blankVotes);
      expect(res.contest_result.certification).toBe(contest._contestResult.certification);
      expect(res.ballot_line_results.id).toBe(contest._ballotLineResults.data.elementId);
      expect(res.ballot_line_results.candidate_id).toBe(contest._ballotLineResults.data.candidateId);
      expect(res.ballot_line_results.response_id).toBe(contest._ballotLineResults.data.ballotResponseId);
      expect(res.ballot_line_results.votes).toBe(contest._ballotLineResults.data.votes);
      expect(res.ballot_line_results.certification).toBe(contest._ballotLineResults.data.certification);
    });
  });

  describe('mapBallot Test', function() {
    it('returns the data', function() {
      var ballot = data.ballot;
      var res = mappers.mapBallot('path', ballot);
      expect(res.id).toBe(ballot.elementId);
      expect(res.write_in).toBe(ballot.writeIn);
      expect(res.image_url).toBe(ballot.imageUrl);
      expect(res.referenda.id).toBe(ballot._referenda.data.elementId);
      expect(res.referenda.title).toBe(ballot._referenda.data.title);
      expect(res.custom_ballot.id).toBe(ballot._customBallot.elementId);
      expect(res.custom_ballot.heading).toBe(ballot._customBallot.heading);
      expect(res.custom_ballot.ballot_responses.id).toBe(ballot._customBallot.ballotResponses.data._response.elementId);
      expect(res.custom_ballot.ballot_responses.text).toBe(ballot._customBallot.ballotResponses.data._response.text);
      expect(res.custom_ballot.ballot_responses.sort_order).toBe(ballot._customBallot.ballotResponses.data._response.sortOrder);
    });
  });

  describe('mapReferenda Test', function() {
    it('returns the data', function() {
      var referenda = data.referenda;
      data.mapFunc.map = function(callback) {
        return callback(referenda);
      };
      var res = mappers.mapReferenda('path', data.mapFunc);

      expect(res.id).toBe(referenda.elementId);
      expect(res.title).toBe(referenda.title);
    });
  });

  describe('mapReferendum Test', function() {
    it('returns the data', function() {
      var referendum = data.referendum;
      var res = mappers.mapReferendum('', referendum);

      expect(res.id).toBe(referendum.elementId);
      expect(res.title).toBe(referendum.title);
      expect(res.subtitle).toBe(referendum.subtitle);
      expect(res.brief).toBe(referendum.brief);
      expect(res.text).toBe(referendum.text);
      expect(res.pro_statement).toBe(referendum.proStatement);
      expect(res.con_statement).toBe(referendum.conStatement);
      expect(res.passage_threshold).toBe(referendum.passageThreshold);
      expect(res.effect_of_abstain).toBe(referendum.effectOfAbstain);
      expect(res.ballot_responses.id).toBe(data.ballotResponse._response.elementId);
      expect(res.ballot_responses.text).toBe(data.ballotResponse._response.text);
      expect(res.ballot_responses.sort_order).toBe(data.ballotResponse._response.sortOrder)
    });
  });

  describe('mapBallotCandidates Test', function() {
    it('returns the data', function() {
      var candidates = data.candidates;
      data.mapFunc.map = function(callback) {
        return callback(candidates);
      };
      var res = mappers.mapBallotCandidates('path', data.mapFunc);

      expect(res.id).toBe(candidates.elementId);
      expect(res.name).toBe(candidates._candidate.name);
      expect(res.party).toBe(candidates._candidate.party);
      expect(res.sort_order).toBe(candidates.sortOrder);
    });
  });

  describe('mapCandidate Test', function() {
    it('returns the data', function() {
      var candidate = data.candidate;
      var res = mappers.mapCandidate('path', candidate);
      expect(res.id).toBe(candidate.elementId);
      expect(res.name).toBe(candidate.name);
      expect(res.incumbent).toBe(candidate.incumbent);
      expect(res.party).toBe(candidate.party);
      expect(res.candidate_url).toBe(candidate.candidateUrl);
      expect(res.biography).toBe(candidate.biography);
      expect(res.phone).toBe(candidate.phone);
      expect(res.photo_url).toBe(candidate.photoUrl);
      nodeUtil.testMapperAddress(res.filed_mailing_address, candidate.filedMailingAddress)
      expect(res.email).toBe(candidate.email);
      expect(res.sort_order).toBe(candidate.sortOrder);
    });
  });

  describe('mapPollingLocation', function() {
    it('returns the data', function() {
      var location = data.pollingLocation;
      var res = mappers.mapPollingLocation('path', location);

      expect(res.id).toBe(location.elementId);
      nodeUtil.testMapperAddress(res.address, location.address);
      expect(res.directions).toBe(location.directions);
      expect(res.photo_url).toBe(location.photoUrl);
      expect(res.polling_hours).toBe(location.pollingHours);
    });
  });

  describe('mapOverviewTables' , function() {
    it('returns the data', function() {
      var overview = data.overview;
      var res = mappers.mapOverviewTables(overview);

      expect(res[0].element_type).toBe(overview[0].elementType);
      expect(res[0].amount).toBe(overview[0].amount);
      expect(res[0].complete_pct).toBe(overview[0].completePct);
      expect(res[0].error_count).toBe(overview[0].errorCount);
    });
  });
});
