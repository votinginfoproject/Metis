/**
 * Created by rcartier13 on 1/8/14.
 */
var mongoose = require('mongoose');
var nodeUtil = require('./nodeUtil');
var schemas = require('../../../dao/schemas');
var mockXml = require('./mockXml');

describe('Mapper Unit Tests', function() {

  describe('baseMapper Save tests', function() {
    it('Returns false if undefined', function() {
      // Retrieves the Ballot module to create a new ballet model
      var Ballot = require('../../../feed-processor/mappers/Ballot');
      var model = new Ballot(schemas.models, mongoose.Schema.Types.ObjectId(1));

      // Calls save then checks to make sure that it return false
      var something = model.save(function() {}, function() {});
      expect(something).not.toBeDefined();
    });

    it('Calls the save function', function(done) {
      var Ballot = require('../../../feed-processor/mappers/Ballot');
      schemas.initSchemas(mongoose);

      var model = new Ballot(schemas.models, mongoose.Schema.Types.ObjectId(1));
      var save = function() {  };
      nodeUtil.mapperTest3_0(save, model, mockXml.ballotXML, done);
    });
  });

  describe('Ballot Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var Ballot = require('../../../feed-processor/mappers/Ballot');
      var xml = mockXml.ballotXML;
      var model = new Ballot(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.referendumIds[0].elementId).toBe(xml.referendum_id[0].$text);
        expect(doc.referendumIds[1].sortOrder).toBe(xml.referendum_id[1].$.sort_order);
        expect(doc.candidates[0].elementId).toBe(xml.candidate_id[0].$text);
        expect(doc.candidates[1].sortOrder).toBe(xml.candidate_id[1].$.sort_order);
        expect(doc.customBallotId).toBe(xml.custom_ballot_id);
        expect(doc.writeIn).toBe(true);
        expect(doc.imageUrl).toBe(xml.image_url);
      };

      nodeUtil.mapperTest3_0(save, model, xml, done);
      model.trimStrings();
      expect(model.model.imageUrl).toBe(xml.image_url.trim());
    });

    it('Xml5_0 maps properly', function(done) {
      var Ballot = require('../../../feed-processor/mappers/Ballot');
      var xml = mockXml.ballotXML;
      var model = new Ballot(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.referendumIds[0].elementId).toBe(xml.referendum_id[0].$text);
        expect(doc.referendumIds[1].sortOrder).toBe(xml.referendum_id[1].$.sort_order);
        expect(doc.candidates[0].elementId).toBe(xml.candidate_id[0].$text);
        expect(doc.candidates[1].sortOrder).toBe(xml.candidate_id[1].$.sort_order);
        expect(doc.customBallotId).toBe(xml.custom_ballot_id);
        expect(doc.writeIn).toBe(true);
        expect(doc.imageUrl).toBe(xml.image_url);
        expect(doc.contestIds[0].elementId).toBe(xml.contest_id[0].$text);
        expect(doc.contestIds[0].sortOrder).toBe(xml.contest_id[0].$.sort_order);
      };

      nodeUtil.mapperTest5_0(save, model, xml, done);
      model.trimStrings();
      expect(model.model.imageUrl).toBe(xml.image_url.trim());
    });
  });

  describe('Ballot Line Result Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var BallotLineResult = require('../../../feed-processor/mappers/BallotLineResult');
      var xml = mockXml.ballotLineResultXml;
      var model = new BallotLineResult(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.contestId).toBe(xml.contest_id);
        expect(doc.jurisdictionId).toBe(xml.jurisdiction_id);
        expect(doc.entireDistrict).toBe(false);
        expect(doc.candidateId).toBe(xml.candidate_id[0]);
        expect(doc.ballotResponseId).toBe(xml.ballot_response_id[0]);
        expect(doc.votes).toBe(xml.votes);
        expect(doc.victorious).toBe(true);
        expect(doc.certification).toBe(xml.$.certification);
      };
      nodeUtil.mapperTest3_0(save, model, xml, done);
    });

    it('Xml5_0 maps properly', function(done) {
      var BallotLineResult = require('../../../feed-processor/mappers/BallotLineResult');
      var xml = mockXml.ballotLineResultXml;
      var model = new BallotLineResult(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.contestId).toBe(xml.contest_id);
        expect(doc.jurisdictionId).toBe(xml.jurisdiction_id);
        expect(doc.entireDistrict).toBe(false);
        expect(doc.candidateId).toBe(xml.candidate_id[0]);
        expect(doc.ballotResponseId).toBe(xml.ballot_response_id[0]);
        expect(doc.votes).toBe(xml.votes);
        expect(doc.victorious).toBe(true);
        expect(doc.certification).toBe(xml.$.certification);
        expect(doc.referendumId).toBe(xml.referendum_id);
        expect(doc.voteType).toBe(xml.vote_type);
      };
      nodeUtil.mapperTest5_0(save, model, xml, done);
    });
  });

  describe('Ballot Response Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var BallotResponse = require('../../../feed-processor/mappers/BallotResponse');
      var xml = mockXml.ballotResponseXml;
      var model = new BallotResponse(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.text).toBe(xml.text);
        expect(doc.sortOrder).toBe(xml.sort_order);
      };
      nodeUtil.mapperTest3_0(save, model, xml, done);
    });

    it('Xml5_0 maps properly', function(done) {
      var BallotResponse = require('../../../feed-processor/mappers/BallotResponse');
      var xml = mockXml.ballotResponseXml;
      var model = new BallotResponse(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.text).toBe(xml.text);
        expect(doc.sortOrder).toBe(xml.sort_order);
      };
      nodeUtil.mapperTest5_0(save, model, xml, done);
    });
  });

  describe('Candidate Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var Candidate = require('../../../feed-processor/mappers/Candidate');
      var xml = mockXml.candidateXml;
      var model = new Candidate(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.name).toBe(xml.name);
        expect(doc.party).toBe(xml.party);
        expect(doc.candidateUrl).toBe(xml.candidate_url);
        expect(doc.biography).toBe(xml.biography);
        expect(doc.phone).toBe(xml.phone);
        expect(doc.photoUrl).toBe(xml.photo_url);
        nodeUtil.testXmlAddress(doc.filedMailingAddress, xml.filed_mailing_address);
        expect(doc.email).toBe(xml.email);
        expect(doc.sortOrder).toBe(xml.sort_order);
      };
      nodeUtil.mapperTest3_0(save, model, xml, done);
    });

    it('Xml5_0 maps properly', function(done) {
      var Candidate = require('../../../feed-processor/mappers/Candidate');
      var xml = mockXml.candidateXml;
      var model = new Candidate(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.name).toBe(xml.name);
        expect(doc.candidateUrl).toBe(xml.candidate_url);
        expect(doc.biography).toBe(xml.biography);
        expect(doc.phone).toBe(xml.phone);
        expect(doc.photoUrl).toBe(xml.photo_url);
        nodeUtil.testXmlAddress(doc.filedMailingAddress, xml.filed_mailing_address);
        expect(doc.email).toBe(xml.email);
        expect(doc.sortOrder).toBe(xml.sort_order);
        expect(doc.incumbent).toBe(true);
        expect(doc.lastName).toBe(xml.last_name);
        expect(doc.partyId).toBe(xml.party_id[0]);
        expect(doc.candidateStatus).toBe(xml.candidate_status);
      };
      nodeUtil.mapperTest5_0(save, model, xml, done);
    });
  });

  describe('Contest Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var Contest = require('../../../feed-processor/mappers/Contest');
      var xml = mockXml.contestXml;
      var model = new Contest(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.electionId).toBe(xml.election_id);
        expect(doc.electoralDistrictId).toBe(xml.electoral_district_id[0]);
        expect(doc.type).toBe(xml.type);
        expect(doc.partisan).toBe(true);
        expect(doc.primaryParty).toBe(xml.primary_party);
        expect(doc.electorateSpecifications).toBe(xml.electorate_specifications);
        expect(doc.special).toBe(false);
        expect(doc.office).toBe(xml.office);
        expect(doc.filingClosedDate.toString()).toBe(xml.filing_closed_date);
        expect(doc.numberElected).toBe(xml.number_elected);
        expect(doc.numberVotingFor).toBe(xml.number_voting_for);
        expect(doc.ballotId).toBe(xml.ballot_id);
        expect(doc.ballotPlacement).toBe(xml.ballot_placement);
      };
      nodeUtil.mapperTest3_0(save, model, xml, done);
    });

    it('Xml5_0 maps properly', function(done) {
      var Contest = require('../../../feed-processor/mappers/Contest');
      var xml = mockXml.contestXml;
      var model = new Contest(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.electionId).toBe(xml.election_id);
        expect(doc.electoralDistrictId).toBe(xml.electoral_district_id[0]);
        expect(doc.type).toBe(xml.type);
        expect(doc.partisan).toBe(true);
        expect(doc.electorateSpecifications).toBe(xml.electorate_specifications);
        expect(doc.special).toBe(false);
        expect(doc.office).toBe(xml.office);
        expect(doc.filingClosedDate.toString()).toBe(xml.filing_closed_date);
        expect(doc.numberElected).toBe(xml.number_elected);
        expect(doc.numberVotingFor).toBe(xml.number_voting_for);
        expect(doc.ballotId).toBe(xml.ballot_id);
        expect(doc.ballotPlacement).toBe(xml.ballot_placement);
        expect(doc.primaryPartyId).toBe(xml.primary_party_id);
        expect(doc.writeIn).toBe(true);
      };
      nodeUtil.mapperTest5_0(save, model, xml, done);
    });
  });

  describe('Contest Result Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var ContestResult = require('../../../feed-processor/mappers/ContestResult');
      var xml = mockXml.contestResultXml;
      var model = new ContestResult(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.contestId).toBe(xml.contest_id);
        expect(doc.jurisdictionId).toBe(xml.jurisdiction_id);
        expect(doc.entireDistrict).toBe(true);
        expect(doc.totalVotes).toBe(xml.total_votes);
        expect(doc.totalValidVotes).toBe(xml.total_valid_votes);
        expect(doc.overvotes).toBe(xml.overvotes);
        expect(doc.blankVotes).toBe(xml.blank_votes);
        expect(doc.acceptedProvisionalVotes).toBe(xml.accepted_provisional_votes);
        expect(doc.rejectedVotes).toBe(xml.rejected_votes);
        expect(doc.certification).toBe(xml.$.certification);
      };
      nodeUtil.mapperTest3_0(save, model, xml, done);
    });

    it('Xml5_0 maps properly', function(done) {
      var ContestResult = require('../../../feed-processor/mappers/ContestResult');
      var xml = mockXml.contestResultXml;
      var model = new ContestResult(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.contestId).toBe(xml.contest_id);
        expect(doc.jurisdictionId).toBe(xml.jurisdiction_id);
        expect(doc.entireDistrict).toBe(true);
        expect(doc.totalVotes).toBe(xml.total_votes);
        expect(doc.totalValidVotes).toBe(xml.total_valid_votes);
        expect(doc.overvotes).toBe(xml.overvotes);
        expect(doc.blankVotes).toBe(xml.blank_votes);
        expect(doc.acceptedProvisionalVotes).toBe(xml.accepted_provisional_votes);
        expect(doc.rejectedVotes).toBe(xml.rejected_votes);
        expect(doc.certification).toBe(xml.$.certification);
        expect(doc.referendumId).toBe(xml.referendum_id);
        expect(doc.voteType).toBe(true);
      };
      nodeUtil.mapperTest5_0(save, model, xml, done);
    });
  });

  describe('Custom Ballot Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var CustomBallot = require('../../../feed-processor/mappers/CustomBallot');
      var xml = mockXml.customBallotXml;
      var model = new CustomBallot(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.heading).toBe(xml.heading);
        expect(doc.ballotResponses[0].elementId).toBe(xml.ballot_response_id[0].$text);
        expect(doc.ballotResponses[0].sortOrder).toBe(xml.ballot_response_id[0].$.sort_order);
      };
      nodeUtil.mapperTest3_0(save, model, xml, done);
    });

    it('Xml5_0 maps properly', function(done) {
      var CustomBallot = require('../../../feed-processor/mappers/CustomBallot');
      var xml = mockXml.customBallotXml;
      var model = new CustomBallot(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.heading).toBe(xml.heading);
        expect(doc.ballotResponses[0].elementId).toBe(xml.ballot_response_id[0].$text);
        expect(doc.ballotResponses[0].sortOrder).toBe(xml.ballot_response_id[0].$.sort_order);
      };
      nodeUtil.mapperTest5_0(save, model, xml, done);
    });
  });

  describe('Early Vote Site Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var EarlyVoteSite = require('../../../feed-processor/mappers/EarlyVoteSite');
      var xml = mockXml.earlyVoteSiteXml;
      var model = new EarlyVoteSite(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.name).toBe(xml.name);
        nodeUtil.testXmlAddress(doc.address, xml.address);
        expect(doc.directions).toBe(xml.directions);
        expect(doc.voterServices).toBe(xml.voter_services);
        expect(doc.startDate.toString()).toBe(xml.start_date);
        expect(doc.endDate.toString()).toBe(xml.end_date);
        expect(doc.daysTimesOpen).toBe(xml.days_times_open);
      };
      nodeUtil.mapperTest3_0(save, model, xml, done);
    });

    it('Xml5_0 maps properly', function(done) {
      var EarlyVoteSite = require('../../../feed-processor/mappers/EarlyVoteSite');
      var xml = mockXml.earlyVoteSiteXml;
      var model = new EarlyVoteSite(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.name).toBe(xml.name);
        nodeUtil.testXmlAddress(doc.address, xml.address);
        expect(doc.directions).toBe(xml.directions);
        expect(doc.voterServices).toBe(xml.voter_services);
        expect(doc.startDate.toString()).toBe(xml.start_date);
        expect(doc.endDate.toString()).toBe(xml.end_date);
        expect(doc.daysTimesOpen).toBe(xml.days_times_open);
      };
      nodeUtil.mapperTest5_0(save, model, xml, done);
    });
  });

  describe('Election Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var Election = require('../../../feed-processor/mappers/Election');
      var xml = mockXml.electionXml;
      var model = new Election(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.date.toString()).toBe(xml.date);
        expect(doc.electionType).toBe(xml.election_type);
        expect(doc.stateId).toBe(xml.state_id);
        expect(doc.statewide).toBe(true);
        expect(doc.registrationInfo).toBe(xml.registration_info);
        expect(doc.absenteeBallotInfo).toBe(xml.absentee_ballot_info);
        expect(doc.resultsUrl).toBe(xml.results_url);
        expect(doc.pollingHours).toBe(xml.polling_hours);
        expect(doc.electionDayRegistration).toBe(false);
        expect(doc.registrationDeadline.toString()).toBe(xml.registration_deadline);
        expect(doc.absenteeRequestDeadline.toString()).toBe(xml.absentee_request_deadline);
      };
      nodeUtil.mapperTest3_0(save, model, xml, done);
    });

    it('Xml5_0 maps properly', function(done) {
      var Election = require('../../../feed-processor/mappers/Election');
      var xml = mockXml.electionXml;
      var model = new Election(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.date.toString()).toBe(xml.date);
        expect(doc.electionType).toBe(xml.election_type);
        expect(doc.stateId).toBe(xml.state_id);
        expect(doc.statewide).toBe(true);
        expect(doc.registrationInfo).toBe(xml.registration_info);
        expect(doc.absenteeBallotInfo).toBe(xml.absentee_ballot_info);
        expect(doc.resultsUrl).toBe(xml.results_url);
        expect(doc.pollingHours).toBe(xml.polling_hours);
        expect(doc.electionDayRegistration).toBe(false);
        expect(doc.registrationDeadline.toString()).toBe(xml.registration_deadline);
        expect(doc.absenteeRequestDeadline.toString()).toBe(xml.absentee_request_deadline);
        expect(doc.name).toBe(xml.name);
        expect(doc.divisionId[0]).toBe(xml.division_id);
        expect(doc.uocavaMailDeadline.toString()).toBe(xml.uocava_mail_deadline);
      };
      nodeUtil.mapperTest5_0(save, model, xml, done);
    });
  });

  describe('Election Administration Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var ElectionAdministration = require('../../../feed-processor/mappers/ElectionAdministration');
      var xml = mockXml.electionAdministrationXml;
      var model = new ElectionAdministration(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.name).toBe(xml.name);
        expect(doc.eoId).toBe(xml.eo_id);
        expect(doc.ovcId).toBe(xml.ovc_id);
        nodeUtil.testXmlAddress(doc.physicalAddress, xml.physical_address);
        nodeUtil.testXmlAddress(doc.mailingAddress, xml.mailing_address);
        expect(doc.electionsUrl).toBe(xml.elections_url);
        expect(doc.registrationUrl).toBe(xml.registration_url);
        expect(doc.amIRegisteredUrl).toBe(xml.am_i_registered_url);
        expect(doc.absenteeUrl).toBe(xml.absentee_url);
        expect(doc.whereDoIVoteUrl).toBe(xml.where_do_i_vote_url);
        expect(doc.whatIsOnMyBallotUrl).toBe(xml.what_is_on_my_ballot_url);
        expect(doc.rulesUrl).toBe(xml.rules_url);
        expect(doc.voterServices).toBe(xml.voter_services);
        expect(doc.hours).toBe(xml.hours);
      };
      nodeUtil.mapperTest3_0(save, model, xml, done);
    });

    it('Xml5_0 maps properly', function(done) {
      var ElectionAdministration = require('../../../feed-processor/mappers/ElectionAdministration');
      var xml = mockXml.electionAdministrationXml;
      var model = new ElectionAdministration(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.name).toBe(xml.name);
        expect(doc.eoId).toBe(xml.eo_id);
        expect(doc.ovcId).toBe(xml.ovc_id);
        nodeUtil.testXmlAddress(doc.physicalAddress, xml.physical_address);
        nodeUtil.testXmlAddress(doc.mailingAddress, xml.mailing_address);
        expect(doc.electionsUrl).toBe(xml.elections_url);
        expect(doc.registrationUrl).toBe(xml.registration_url);
        expect(doc.amIRegisteredUrl).toBe(xml.am_i_registered_url);
        expect(doc.absenteeUrl).toBe(xml.absentee_url);
        expect(doc.whereDoIVoteUrl).toBe(xml.where_do_i_vote_url);
        expect(doc.whatIsOnMyBallotUrl).toBe(xml.what_is_on_my_ballot_url);
        expect(doc.rulesUrl).toBe(xml.rules_url);
        expect(doc.voterServices).toBe(xml.voter_services);
        expect(doc.hours).toBe(xml.hours);
        expect(doc.email).toBe(xml.email);
        expect(doc.phone).toBe(xml.phone);
      };
      nodeUtil.mapperTest5_0(save, model, xml, done);
    });
  });

  describe('Election Official Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var ElectionOfficial = require('../../../feed-processor/mappers/ElectionOfficial');
      var xml = mockXml.electionOfficialXml;
      var model = new ElectionOfficial(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.name).toBe(xml.name);
        expect(doc.title).toBe(xml.title);
        expect(doc.phone).toBe(xml.phone);
        expect(doc.fax).toBe(xml.fax);
        expect(doc.email).toBe(xml.email);
      };
      nodeUtil.mapperTest3_0(save, model, xml, done);
    });

    it('Xml5_0 maps properly', function(done) {
      var ElectionOfficial = require('../../../feed-processor/mappers/ElectionOfficial');
      var xml = mockXml.electionOfficialXml;
      var model = new ElectionOfficial(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.name).toBe(xml.name);
        expect(doc.title).toBe(xml.title);
        expect(doc.phone).toBe(xml.phone);
        expect(doc.fax).toBe(xml.fax);
        expect(doc.email).toBe(xml.email);
        expect(doc.electionAdminId).toBe(xml.election_administration_id);
      };
      nodeUtil.mapperTest5_0(save, model, xml, done);
    });
  });

  describe('Electoral District Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var ElectoralDistrict = require('../../../feed-processor/mappers/ElectoralDistrict');
      var xml = mockXml.electoralDistrictXml;
      var model = new ElectoralDistrict(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.name).toBe(xml.name);
        expect(doc.type).toBe(xml.type);
        expect(doc.number).toBe(xml.number);
      };
      nodeUtil.mapperTest3_0(save, model, xml, done);
    });

    it('Xml5_0 maps properly', function(done) {
      var ElectoralDistrict = require('../../../feed-processor/mappers/ElectoralDistrict');
      var xml = mockXml.electoralDistrictXml;
      var model = new ElectoralDistrict(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.name).toBe(xml.name);
        expect(doc.type).toBe(xml.type);
        expect(doc.number).toBe(xml.number);
        expect(doc.description).toBe(xml.description);
      };
      nodeUtil.mapperTest5_0(save, model, xml, done);
    });
  });

  describe('Locality Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var Locality = require('../../../feed-processor/mappers/Locality');
      var xml = mockXml.localityXml;
      var model = new Locality(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.name).toBe(xml.name);
        expect(doc.stateId).toBe(xml.state_id);
        expect(doc.type).toBe(xml.type);
        expect(doc.electionAdminId).toBe(xml.election_administration_id);
        expect(doc.earlyVoteSiteIds[0]).toBe(xml.early_vote_site_id[0]);
      };
      nodeUtil.mapperTest3_0(save, model, xml, done);
    });

    it('Xml5_0 maps properly', function(done) {
      var Locality = require('../../../feed-processor/mappers/Locality');
      var xml = mockXml.localityXml;
      var model = new Locality(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.name).toBe(xml.name);
        expect(doc.stateId).toBe(xml.state_id);
        expect(doc.type).toBe(xml.type);
        expect(doc.electionAdminId).toBe(xml.election_administration_id);
        expect(doc.earlyVoteSiteIds[0]).toBe(xml.early_vote_site_id[0]);
        expect(doc.pollbookTypes[0]).toBe(xml.pollbook_type[0]);
        expect(doc.parentIds[0]).toBe(xml.parent_id);
      };
      nodeUtil.mapperTest5_0(save, model, xml, done);
    });
  });

  describe('Polling Location Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var PollingLocation = require('../../../feed-processor/mappers/PollingLocation');
      var xml = mockXml.pollingLocationXml;
      var model = new PollingLocation(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        nodeUtil.testXmlAddress(doc.address, xml.address);
        expect(doc.directions).toBe(xml.directions);
        expect(doc.pollingHours).toBe(xml.polling_hours);
        expect(doc.photoUrl).toBe(xml.photo_url);
      };
      nodeUtil.mapperTest3_0(save, model, xml, done);
    });

    it('Xml5_0 maps properly', function(done) {
      var PollingLocation = require('../../../feed-processor/mappers/PollingLocation');
      var xml = mockXml.pollingLocationXml;
      var model = new PollingLocation(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        nodeUtil.testXmlAddress(doc.address, xml.address);
        expect(doc.directions).toBe(xml.directions);
        expect(doc.pollingHours).toBe(xml.polling_hours);
        expect(doc.photoUrl).toBe(xml.photo_url);
        expect(doc.name).toBe(xml.name);
      };
      nodeUtil.mapperTest5_0(save, model, xml, done);
    });
  });

  describe('Precinct Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var Precinct = require('../../../feed-processor/mappers/Precinct');
      var xml = mockXml.precinctXml;
      var model = new Precinct(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.name).toBe(xml.name);
        expect(doc.number).toBe(xml.number);
        expect(doc.localityId).toBe(xml.locality_id);
        expect(doc.electoralDistrictIds[0]).toBe(xml.electoral_district_id[0]);
        expect(doc.ward).toBe(xml.ward);
        expect(doc.mailOnly).toBe(true);
        expect(doc.pollingLocationIds[0]).toBe(xml.polling_location_id[0]);
        expect(doc.earlyVoteSiteIds[0]).toBe(xml.early_vote_site_id[0]);
        expect(doc.ballotStyleImageUrl).toBe(xml.ballot_style_image_url);
      };
      nodeUtil.mapperTest3_0(save, model, xml, done);
    });

    it('Xml5_0 maps properly', function(done) {
      var Precinct = require('../../../feed-processor/mappers/Precinct');
      var xml = mockXml.precinctXml;
      var model = new Precinct(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.name).toBe(xml.name);
        expect(doc.number).toBe(xml.number);
        expect(doc.localityId).toBe(xml.locality_id);
        expect(doc.electoralDistrictIds[0]).toBe(xml.electoral_district_id[0]);
        expect(doc.ward).toBe(xml.ward);
        expect(doc.mailOnly).toBe(true);
        expect(doc.pollingLocationIds[0]).toBe(xml.polling_location_id[0]);
        expect(doc.earlyVoteSiteIds[0]).toBe(xml.early_vote_site_id[0]);
        expect(doc.ballotStyleImageUrl).toBe(xml.ballot_style_image_url);
      };
      nodeUtil.mapperTest5_0(save, model, xml, done);
    });
  });

  describe('Precinct Split Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var PrecinctSplit = require('../../../feed-processor/mappers/PrecinctSplit');
      var xml = mockXml.precinctSplitXml;
      var model = new PrecinctSplit(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.name).toBe(xml.name);
        expect(doc.precinctId).toBe(xml.precinct_id);
        expect(doc.electoralDistrictIds[0]).toBe(xml.electoral_district_id[0]);
        expect(doc.pollingLocationIds[0]).toBe(xml.polling_location_id[0]);
        expect(doc.ballotStyleImageUrl).toBe(xml.ballot_style_image_url);
      };
      nodeUtil.mapperTest3_0(save, model, xml, done);
    });

    it('Xml5_0 maps properly', function(done) {
      var PrecinctSplit = require('../../../feed-processor/mappers/PrecinctSplit');
      var xml = mockXml.precinctSplitXml;
      var model = new PrecinctSplit(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.name).toBe(xml.name);
        expect(doc.precinctId).toBe(xml.precinct_id);
        expect(doc.electoralDistrictIds[0]).toBe(xml.electoral_district_id[0]);
        expect(doc.pollingLocationIds[0]).toBe(xml.polling_location_id[0]);
        expect(doc.ballotStyleImageUrl).toBe(xml.ballot_style_image_url);
      };
      nodeUtil.mapperTest5_0(save, model, xml, done);
    });
  });

  describe('Referendum Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var Referendum = require('../../../feed-processor/mappers/Referendum');
      var xml = mockXml.referendumXml;
      var model = new Referendum(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.title).toBe(xml.title);
        expect(doc.subtitle).toBe(xml.subtitle);
        expect(doc.brief).toBe(xml.brief);
        expect(doc.text).toBe(xml.text);
        expect(doc.proStatement).toBe(xml.pro_statement);
        expect(doc.conStatement).toBe(xml.con_statement);
        expect(doc.passageThreshold).toBe(xml.passage_threshold);
        expect(doc.effectOfAbstain).toBe(xml.effect_of_abstain);
        expect(doc.ballotResponses[0].elementId).toBe(xml.ballot_response_id[0].$text);
        expect(doc.ballotResponses[0].sortOrder).toBe(xml.ballot_response_id[0].$.sort_order);
      };
      nodeUtil.mapperTest3_0(save, model, xml, done);
    });

    it('Xml5_0 maps properly', function(done) {
      var Referendum = require('../../../feed-processor/mappers/Referendum');
      var xml = mockXml.referendumXml;
      var model = new Referendum(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.title).toBe(xml.title);
        expect(doc.subtitle).toBe(xml.subtitle);
        expect(doc.brief).toBe(xml.brief);
        expect(doc.text).toBe(xml.text);
        expect(doc.proStatement).toBe(xml.pro_statement);
        expect(doc.conStatement).toBe(xml.con_statement);
        expect(doc.passageThreshold).toBe(xml.passage_threshold);
        expect(doc.effectOfAbstain).toBe(xml.effect_of_abstain);
        expect(doc.ballotResponses[0].elementId).toBe(xml.ballot_response_id[0].$text);
        expect(doc.ballotResponses[0].sortOrder).toBe(xml.ballot_response_id[0].$.sort_order);
        expect(doc.electoralDistrictId).toBe(xml.electoral_district_id);
        expect(doc.ballotPlacement).toBe(xml.ballot_placement);
      };
      nodeUtil.mapperTest5_0(save, model, xml, done);
    });
  });

  describe('Source Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var Source = require('../../../feed-processor/mappers/Source');
      var xml = mockXml.sourceXml;
      var model = new Source(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.vipId).toBe(xml.vip_id);
        expect(doc.datetime.toString()).toBe(xml.datetime);
        expect(doc.description).toBe(xml.description);
        expect(doc.name).toBe(xml.name);
        expect(doc.organizationUrl).toBe(xml.organization_url);
        expect(doc.feedContactId).toBe(xml.feed_contact_id);
        expect(doc.touUrl).toBe(xml.tou_url);
      };
      nodeUtil.mapperTest3_0(save, model, xml, done);
    });

    it('Xml5_0 maps properly', function(done) {
      var Source = require('../../../feed-processor/mappers/Source');
      var xml = mockXml.sourceXml;
      var model = new Source(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.vipId).toBe(xml.vip_id);
        expect(doc.datetime.toString()).toBe(xml.datetime);
        expect(doc.description).toBe(xml.description);
        expect(doc.name).toBe(xml.name);
        expect(doc.organizationUrl).toBe(xml.organization_url);
        expect(doc.feedContactId).toBe(xml.feed_contact_id);
        expect(doc.touUrl).toBe(xml.tou_url);
      };
      nodeUtil.mapperTest5_0(save, model, xml, done);
    });
  });

  describe('State Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var State = require('../../../feed-processor/mappers/State');
      var xml = mockXml.stateXml;
      var model = new State(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.name).toBe(xml.name);
        expect(doc.electionAdministrationId).toBe(xml.election_administration_id);
        expect(doc.earlyVoteSiteIds[0]).toBe(xml.early_vote_site_id[0])
      };
      nodeUtil.mapperTest3_0(save, model, xml, done);
    });

    it('Xml5_0 maps properly', function(done) {
      var State = require('../../../feed-processor/mappers/State');
      var xml = mockXml.stateXml;
      var model = new State(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.name).toBe(xml.name);
        expect(doc.electionAdministrationId).toBe(xml.election_administration_id);
        expect(doc.earlyVoteSiteIds[0]).toBe(xml.early_vote_site_id[0]);
        expect(doc.abbreviation).toBe(xml.abbreviation);
        expect(doc.region).toBe(xml.region);
      };
      nodeUtil.mapperTest5_0(save, model, xml, done);
    });
  });

  describe('Street Segment Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var StreetSegment = require('../../../feed-processor/mappers/StreetSegment');
      var xml = mockXml.streetSegmentXml;
      var model = new StreetSegment(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.startHouseNumber).toBe(xml.start_house_number);
        expect(doc.endHouseNumber).toBe(xml.end_house_number);
        expect(doc.startApartmentNumber).toBe(xml.start_apartment_number);
        expect(doc.endApartmentNumber).toBe(xml.end_apartment_number);
        expect(doc.nonHouseAddress.houseNumber).toBe(xml.non_house_address.house_number);
        expect(doc.nonHouseAddress.houseNumberPrefix).toBe(xml.non_house_address.house_number_prefix);
        expect(doc.nonHouseAddress.houseNumberSuffix).toBe(xml.non_house_address.house_number_suffix);
        expect(doc.nonHouseAddress.streetDirection).toBe(xml.non_house_address.street_direction);
        expect(doc.nonHouseAddress.streetName).toBe(xml.non_house_address.street_name);
        expect(doc.nonHouseAddress.streetSuffix).toBe(xml.non_house_address.street_suffix);
        expect(doc.nonHouseAddress.addressDirection).toBe(xml.non_house_address.address_direction);
        expect(doc.nonHouseAddress.apartment).toBe(xml.non_house_address.apartment);
        expect(doc.nonHouseAddress.city).toBe(xml.non_house_address.city);
        expect(doc.nonHouseAddress.state).toBe(xml.non_house_address.state);
        expect(doc.nonHouseAddress.zip).toBe(xml.non_house_address.zip);
        expect(doc.precinctId).toBe(xml.precinct_id);
        expect(doc.precinctSplitId).toBe(xml.precinct_split_id);
      };
      nodeUtil.mapperTest3_0(save, model, xml, done);
    });

    it('Xml5_0 maps properly', function(done) {
      var StreetSegment = require('../../../feed-processor/mappers/StreetSegment');
      var xml = mockXml.streetSegmentXml;
      var model = new StreetSegment(schemas.models, mongoose.Schema.Types.ObjectId('1'));
      var save = function(doc) {
        expect(doc.elementId).toBe(xml.$.id);
        expect(doc.startHouseNumber).toBe(xml.start_house_number);
        expect(doc.endHouseNumber).toBe(xml.end_house_number);
        expect(doc.startApartmentNumber).toBe(xml.start_apartment_number);
        expect(doc.endApartmentNumber).toBe(xml.end_apartment_number);
        expect(doc.nonHouseAddress.houseNumber).toBe(xml.non_house_address.house_number);
        expect(doc.nonHouseAddress.houseNumberPrefix).toBe(xml.non_house_address.house_number_prefix);
        expect(doc.nonHouseAddress.houseNumberSuffix).toBe(xml.non_house_address.house_number_suffix);
        expect(doc.nonHouseAddress.streetDirection).toBe(xml.non_house_address.street_direction);
        expect(doc.nonHouseAddress.streetName).toBe(xml.non_house_address.street_name);
        expect(doc.nonHouseAddress.streetSuffix).toBe(xml.non_house_address.street_suffix);
        expect(doc.nonHouseAddress.addressDirection).toBe(xml.non_house_address.address_direction);
        expect(doc.nonHouseAddress.apartment).toBe(xml.non_house_address.apartment);
        expect(doc.nonHouseAddress.city).toBe(xml.non_house_address.city);
        expect(doc.nonHouseAddress.state).toBe(xml.non_house_address.state);
        expect(doc.nonHouseAddress.zip).toBe(xml.non_house_address.zip);
        expect(doc.precinctId).toBe(xml.precinct_id);
        expect(doc.precinctSplitId).toBe(xml.precinct_split_id);
        expect(doc.city).toBe(xml.city);
        expect(doc.zip).toBe(xml.zip);
        expect(doc.stateId).toBe(xml.state_id);
      };
      nodeUtil.mapperTest5_0(save, model, xml, done);
    });
  });
});