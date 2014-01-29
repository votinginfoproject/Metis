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
      var model = new Ballot(undefined, mongoose.Schema.Types.ObjectId(1));

      // Calls save then checks to make sure that it return false
      var something = model.save(function() {}, function() {});
      expect(something).toBe(false);
    });

    it('Calls the save function', function(done) {
      var Ballot = require('../../../feed-processor/mappers/Ballot');
      schemas.initSchemas(mongoose);

      var model = new Ballot(schemas.models, mongoose.Schema.Types.ObjectId(1));
      var save = function(cb) { cb(); };
      nodeUtil.mapperTest(save, model, mockXml.ballotXML, done);
    });
  });

  describe('Ballot Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var Ballot = require('../../../feed-processor/mappers/Ballot');
      var xml = mockXml.ballotXML;
      var model = new Ballot(schemas.models, mongoose.Schema.Types.ObjectId(1));
      var save = function(cb) {
        expect(this.elementId).toBe(xml.$.id);
        expect(this.referendumIds[0]).toBe(xml.referendum_id[0]);
        expect(this.candidates[0].elementId).toBe(xml.candidate_id[0].$text);
        expect(this.candidates[1].sortOrder).toBe(xml.candidate_id[1].$.sort_order);
        expect(this.customBallotId).toBe(xml.custom_ballot_id);
        expect(this.writeIn).toBe(true);
        expect(this.imageUrl).toBe(xml.image_url);
        cb();
      };

      nodeUtil.mapperTest(save, model, xml, done);
    });
  });

  describe('Ballot Line Result Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var BallotLineResult = require('../../../feed-processor/mappers/BallotLineResult');
      var xml = mockXml.ballotLineResultXml;
      var model = new BallotLineResult(schemas.models, mongoose.Schema.Types.ObjectId(1));
      var save = function(cb) {
        expect(this.elementId).toBe(xml.$.id);
        expect(this.contestId).toBe(xml.contest_id);
        expect(this.jurisdictionId).toBe(xml.jurisdiction_id);
        expect(this.entireDistrict).toBe(false);
        expect(this.candidateId).toBe(xml.candidate_id[0]);
        expect(this.ballotResponseId).toBe(xml.ballot_response_id[0]);
        expect(this.votes).toBe(xml.votes);
        expect(this.victorious).toBe(true);
        expect(this.certification).toBe(xml.$.certification);
        cb();
      };
      nodeUtil.mapperTest(save, model, xml, done);
    });
  });

  describe('Ballot Response Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var BallotResponse = require('../../../feed-processor/mappers/BallotResponse');
      var xml = mockXml.ballotResponseXml;
      var model = new BallotResponse(schemas.models, mongoose.Schema.Types.ObjectId(1));
      var save = function(cb) {
        expect(this.elementId).toBe(xml.$.id);
        expect(this.text).toBe(xml.text);
        expect(this.sortOrder).toBe(xml.sort_order);
        cb();
      };
      nodeUtil.mapperTest(save, model, xml, done);
    });
  });

  describe('Candidate Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var Candidate = require('../../../feed-processor/mappers/Candidate');
      var xml = mockXml.candidateXml;
      var model = new Candidate(schemas.models, mongoose.Schema.Types.ObjectId(1));
      var save = function(cb) {
        expect(this.elementId).toBe(xml.$.id);
        expect(this.name).toBe(xml.name);
        expect(this.party).toBe(xml.party);
        expect(this.candidateUrl).toBe(xml.candidate_url);
        expect(this.biography).toBe(xml.biography);
        expect(this.phone).toBe(xml.phone);
        expect(this.photoUrl).toBe(xml.photo_url);
        nodeUtil.testXmlAddress(this.filedMailingAddress, xml.filed_mailing_address);
        expect(this.email).toBe(xml.email);
        expect(this.sortOrder).toBe(xml.sort_order);
        cb();
      };
      nodeUtil.mapperTest(save, model, xml, done);
    });
  });

  describe('Contest Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var Contest = require('../../../feed-processor/mappers/Contest');
      var xml = mockXml.contestXml;
      var model = new Contest(schemas.models, mongoose.Schema.Types.ObjectId(1));
      var save = function(cb) {
        expect(this.elementId).toBe(xml.$.id);
        expect(this.electionId).toBe(xml.election_id);
        expect(this.electoralDistrictId).toBe(xml.electoral_district_id[0]);
        expect(this.type).toBe(xml.type);
        expect(this.partisan).toBe(true);
        expect(this.primaryParty).toBe(xml.primary_party);
        expect(this.electorateSpecifications).toBe(xml.electorate_specifications);
        expect(this.special).toBe(false);
        expect(this.office).toBe(xml.office);
        expect(this.filingClosedDate.toString()).toBe(xml.filing_closed_date);
        expect(this.numberElected).toBe(xml.number_elected);
        expect(this.numberVotingFor).toBe(xml.number_voting_for);
        expect(this.ballotId).toBe(xml.ballot_id);
        expect(this.ballotPlacement).toBe(xml.ballot_placement);
        cb();
      };
      nodeUtil.mapperTest(save, model, xml, done);
    });
  });

  describe('Contest Result Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var ContestResult = require('../../../feed-processor/mappers/ContestResult');
      var xml = mockXml.contestResultXml;
      var model = new ContestResult(schemas.models, mongoose.Schema.Types.ObjectId(1));
      var save = function(cb) {
        expect(this.elementId).toBe(xml.$.id);
        expect(this.contestId).toBe(xml.contest_id);
        expect(this.jurisdictionId).toBe(xml.jurisdiction_id);
        expect(this.entireDistrict).toBe(true);
        expect(this.totalVotes).toBe(xml.total_votes);
        expect(this.totalValidVotes).toBe(xml.total_valid_votes);
        expect(this.overvotes).toBe(xml.overvotes);
        expect(this.blankVotes).toBe(xml.blank_votes);
        expect(this.acceptedProvisionalVotes).toBe(xml.accepted_provisional_votes);
        expect(this.rejectedVotes).toBe(xml.rejected_votes);
        expect(this.certification).toBe(xml.$.certification);
        cb();
      };
      nodeUtil.mapperTest(save, model, xml, done);
    });
  });

  describe('Custom Ballot Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var CustomBallot = require('../../../feed-processor/mappers/CustomBallot');
      var xml = mockXml.customBallotXml;
      var model = new CustomBallot(schemas.models, mongoose.Schema.Types.ObjectId(1));
      var save = function(cb) {
        expect(this.elementId).toBe(xml.$.id);
        expect(this.heading).toBe(xml.heading);
        expect(this.ballotResponses[0].elementId).toBe(xml.ballot_response_id[0].$text);
        expect(this.ballotResponses[0].sortOrder).toBe(xml.ballot_response_id[0].$.sort_order);
        cb();
      };
      nodeUtil.mapperTest(save, model, xml, done);
    });
  });

  describe('Early Vote Site Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var EarlyVoteSite = require('../../../feed-processor/mappers/EarlyVoteSite');
      var xml = mockXml.earlyVoteSiteXml;
      var model = new EarlyVoteSite(schemas.models, mongoose.Schema.Types.ObjectId(1));
      var save = function(cb) {
        expect(this.elementId).toBe(xml.$.id);
        expect(this.name).toBe(xml.name);
        nodeUtil.testXmlAddress(this.address, xml.address);
        expect(this.directions).toBe(xml.directions);
        expect(this.voterServices).toBe(xml.voter_services);
        expect(this.startDate.toString()).toBe(xml.start_date);
        expect(this.endDate.toString()).toBe(xml.end_date);
        expect(this.daysTimesOpen).toBe(xml.days_times_open);
        cb();
      };
      nodeUtil.mapperTest(save, model, xml, done);
    });
  });

  describe('Election Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var Election = require('../../../feed-processor/mappers/Election');
      var xml = mockXml.electionXml;
      var model = new Election(schemas.models, mongoose.Schema.Types.ObjectId(1));
      var save = function(cb) {
        expect(this.elementId).toBe(xml.$.id);
        expect(this.date.toString()).toBe(xml.date);
        expect(this.electionType).toBe(xml.election_type);
        expect(this.stateId).toBe(xml.state_id);
        expect(this.statewide).toBe(true);
        expect(this.registrationInfo).toBe(xml.registration_info);
        expect(this.absenteeBallotInfo).toBe(xml.absentee_ballot_info);
        expect(this.resultsUrl).toBe(xml.results_url);
        expect(this.pollingHours).toBe(xml.polling_hours);
        expect(this.electionDayRegistration).toBe(false);
        expect(this.registrationDeadline.toString()).toBe(xml.registration_deadline);
        expect(this.absenteeRequestDeadline.toString()).toBe(xml.absentee_request_deadline);
        cb();
      };
      nodeUtil.mapperTest(save, model, xml, done);
    });
  });

  describe('Election Administration Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var ElectionAdministration = require('../../../feed-processor/mappers/ElectionAdministration');
      var xml = mockXml.electionAdministrationXml;
      var model = new ElectionAdministration(schemas.models, mongoose.Schema.Types.ObjectId(1));
      var save = function(cb) {
        expect(this.elementId).toBe(xml.$.id);
        expect(this.name).toBe(xml.name);
        expect(this.eoId).toBe(xml.eo_id);
        expect(this.ovcId).toBe(xml.ovc_id);
        nodeUtil.testXmlAddress(this.physicalAddress, xml.physical_address);
        nodeUtil.testXmlAddress(this.mailingAddress, xml.mailing_address);
        expect(this.electionsUrl).toBe(xml.elections_url);
        expect(this.registrationUrl).toBe(xml.registration_url);
        expect(this.amIRegisteredUrl).toBe(xml.am_i_registered_url);
        expect(this.absenteeUrl).toBe(xml.absentee_url);
        expect(this.whereDoIVoteUrl).toBe(xml.where_do_i_vote_url);
        expect(this.whatIsOnMyBallotUrl).toBe(xml.what_is_on_my_ballot_url);
        expect(this.rulesUrl).toBe(xml.rules_url);
        expect(this.voterServices).toBe(xml.voter_services);
        expect(this.hours).toBe(xml.hours);
        cb();
      };
      nodeUtil.mapperTest(save, model, xml, done);
    });
  });

  describe('Election Official Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var ElectionOfficial = require('../../../feed-processor/mappers/ElectionOfficial');
      var xml = mockXml.electionOfficialXml;
      var model = new ElectionOfficial(schemas.models, mongoose.Schema.Types.ObjectId(1));
      var save = function(cb) {
        expect(this.elementId).toBe(xml.$.id);
        expect(this.name).toBe(xml.name);
        expect(this.title).toBe(xml.title);
        expect(this.phone).toBe(xml.phone);
        expect(this.fax).toBe(xml.fax);
        expect(this.email).toBe(xml.email);
        cb();
      };
      nodeUtil.mapperTest(save, model, xml, done);
    });
  });

  describe('Electoral District Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var ElectoralDistrict = require('../../../feed-processor/mappers/ElectoralDistrict');
      var xml = mockXml.electoralDistrictXml;
      var model = new ElectoralDistrict(schemas.models, mongoose.Schema.Types.ObjectId(1));
      var save = function(cb) {
        expect(this.elementId).toBe(xml.$.id);
        expect(this.name).toBe(xml.name);
        expect(this.type).toBe(xml.type);
        expect(this.number).toBe(xml.number);
        cb();
      };
      nodeUtil.mapperTest(save, model, xml, done);
    });
  });

  describe('Locality Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var Locality = require('../../../feed-processor/mappers/Locality');
      var xml = mockXml.localityXml;
      var model = new Locality(schemas.models, mongoose.Schema.Types.ObjectId(1));
      var save = function(cb) {
        expect(this.elementId).toBe(xml.$.id);
        expect(this.name).toBe(xml.name);
        expect(this.stateId).toBe(xml.state_id);
        expect(this.type).toBe(xml.type);
        expect(this.electionAdminId).toBe(xml.election_administration_id);
        expect(this.earlyVoteSiteIds[0]).toBe(xml.early_vote_site_id[0]);
        cb();
      };
      nodeUtil.mapperTest(save, model, xml, done);
    });
  });

  describe('Polling Location Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var PollingLocation = require('../../../feed-processor/mappers/PollingLocation');
      var xml = mockXml.pollingLocationXml;
      var model = new PollingLocation(schemas.models, mongoose.Schema.Types.ObjectId(1));
      var save = function(cb) {
        expect(this.elementId).toBe(xml.$.id);
        nodeUtil.testXmlAddress(this.address, xml.address);
        expect(this.directions).toBe(xml.directions);
        expect(this.pollingHours).toBe(xml.polling_hours);
        expect(this.photoUrl).toBe(xml.photo_url);
        cb();
      };
      nodeUtil.mapperTest(save, model, xml, done);
    });
  });

  describe('Precinct Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var Precinct = require('../../../feed-processor/mappers/Precinct');
      var xml = mockXml.precinctXml;
      var model = new Precinct(schemas.models, mongoose.Schema.Types.ObjectId(1));
      var save = function(cb) {
        expect(this.elementId).toBe(xml.$.id);
        expect(this.name).toBe(xml.name);
        expect(this.number).toBe(xml.number);
        expect(this.localityId).toBe(xml.locality_id);
        expect(this.electoralDistrictIds[0]).toBe(xml.electoral_district_id[0]);
        expect(this.ward).toBe(xml.ward);
        expect(this.mailOnly).toBe(true);
        expect(this.pollingLocationIds[0]).toBe(xml.polling_location_id[0]);
        expect(this.earlyVoteSiteIds[0]).toBe(xml.early_vote_site_id[0]);
        expect(this.ballotStyleImageUrl).toBe(xml.ballot_style_image_url);
        cb();
      };
      nodeUtil.mapperTest(save, model, xml, done);
    });
  });

  describe('Precinct Split Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var PrecinctSplit = require('../../../feed-processor/mappers/PrecinctSplit');
      var xml = mockXml.precinctSplitXml;
      var model = new PrecinctSplit(schemas.models, mongoose.Schema.Types.ObjectId(1));
      var save = function(cb) {
        expect(this.elementId).toBe(xml.$.id);
        expect(this.name).toBe(xml.name);
        expect(this.precinctId).toBe(xml.precinct_id);
        expect(this.electoralDistrictIds[0]).toBe(xml.electoral_district_id[0]);
        expect(this.pollingLocationIds[0]).toBe(xml.polling_location_id[0]);
        expect(this.ballotStyleImageUrl).toBe(xml.ballot_style_image_url);
        cb();
      };
      nodeUtil.mapperTest(save, model, xml, done);
    });
  });

  describe('Referendum Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var Referendum = require('../../../feed-processor/mappers/Referendum');
      var xml = mockXml.referendumXml;
      var model = new Referendum(schemas.models, mongoose.Schema.Types.ObjectId(1));
      var save = function(cb) {
        expect(this.elementId).toBe(xml.$.id);
        expect(this.title).toBe(xml.title);
        expect(this.subtitle).toBe(xml.subtitle);
        expect(this.brief).toBe(xml.brief);
        expect(this.text).toBe(xml.text);
        expect(this.proStatement).toBe(xml.pro_statement);
        expect(this.conStatement).toBe(xml.con_statement);
        expect(this.passageThreshold).toBe(xml.passage_threshold);
        expect(this.effectOfAbstain).toBe(xml.effect_of_abstain);
        expect(this.ballotResponses[0].elementId).toBe(xml.ballot_response_id[0].$text);
        expect(this.ballotResponses[0].sortOrder).toBe(xml.ballot_response_id[0].$.sort_order);
        cb();
      };
      nodeUtil.mapperTest(save, model, xml, done);
    });
  });

  describe('Source Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var Source = require('../../../feed-processor/mappers/Source');
      var xml = mockXml.sourceXml;
      var model = new Source(schemas.models, mongoose.Schema.Types.ObjectId(1));
      var save = function(cb) {
        expect(this.elementId).toBe(xml.$.id);
        expect(this.vipId).toBe(xml.vip_id);
        expect(this.datetime.toString()).toBe(xml.datetime);
        expect(this.description).toBe(xml.description);
        expect(this.name).toBe(xml.name);
        expect(this.organizationUrl).toBe(xml.organization_url);
        expect(this.feedContactId).toBe(xml.feed_contact_id);
        expect(this.touUrl).toBe(xml.tou_url);
        cb();
      };
      nodeUtil.mapperTest(save, model, xml, done);
    });
  });

  describe('State Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var State = require('../../../feed-processor/mappers/State');
      var xml = mockXml.stateXml;
      var model = new State(schemas.models, mongoose.Schema.Types.ObjectId(1));
      var save = function(cb) {
        expect(this.elementId).toBe(xml.$.id);
        expect(this.name).toBe(xml.name);
        expect(this.electionAdministrationId).toBe(xml.election_administration_id);
        expect(this.earlyVoteSiteIds[0]).toBe(xml.early_vote_site_id[0])
        cb();
      };
      nodeUtil.mapperTest(save, model, xml, done);
    });
  });

  describe('Street Segment Mapper Tests', function() {
    it('Xml3_0 maps properly', function(done) {
      var StreetSegment = require('../../../feed-processor/mappers/StreetSegment');
      var xml = mockXml.streetSegmentXml;
      var model = new StreetSegment(schemas.models, mongoose.Schema.Types.ObjectId(1));
      var save = function(cb) {
        expect(this.elementId).toBe(xml.$.id);
        expect(this.startHouseNumber).toBe(xml.start_house_number);
        expect(this.endHouseNumber).toBe(xml.end_house_number);
        expect(this.startApartmentNumber).toBe(xml.start_apartment_number);
        expect(this.endApartmentNumber).toBe(xml.end_apartment_number);
        expect(this.nonHouseAddress.houseNumber).toBe(xml.non_house_address.house_number);
        expect(this.nonHouseAddress.houseNumberPrefix).toBe(xml.non_house_address.house_number_prefix);
        expect(this.nonHouseAddress.houseNumberSuffix).toBe(xml.non_house_address.house_number_suffix);
        expect(this.nonHouseAddress.streetDirection).toBe(xml.non_house_address.street_direction);
        expect(this.nonHouseAddress.streetName).toBe(xml.non_house_address.street_name);
        expect(this.nonHouseAddress.streetSuffix).toBe(xml.non_house_address.street_suffix);
        expect(this.nonHouseAddress.addressDirection).toBe(xml.non_house_address.address_direction);
        expect(this.nonHouseAddress.apartment).toBe(xml.non_house_address.apartment);
        expect(this.nonHouseAddress.city).toBe(xml.non_house_address.city);
        expect(this.nonHouseAddress.state).toBe(xml.non_house_address.state);
        expect(this.nonHouseAddress.zip).toBe(xml.non_house_address.zip);
        expect(this.precinctId).toBe(xml.precinct_id);
        expect(this.precinctSplitId).toBe(xml.precinct_split_id);
        cb();
      };
      nodeUtil.mapperTest(save, model, xml, done);
    });
  });
});