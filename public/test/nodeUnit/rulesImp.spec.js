/**
 * Created by rcartier13 on 4/15/14.
 */

var util = require('./nodeUtil');

describe('Rule Implementation Tests', function() {

  describe('Zip Code Rule Test', function() {
    var zipCode = require('../../../feed-processor/rule/impl/zipCodeRule');

    it('Should not crash', function() {
      util.testObjectLevelRules(zipCode, null, function(res) {
        expect(res.isViolated).toBeFalsy();
      });
     util.testObjectLevelRules(zipCode, undefined, function(res) {
        expect(res.isViolated).toBeFalsy();
      })
    });

    it('Should send an error', function() {
      util.testObjectLevelRules(zipCode, '512', function(res) {
        expect(res.isViolated).toBeTruthy();
      });

    });

    it('Should not send an error', function() {
      util.testObjectLevelRules(zipCode, '51123', function(res) {
        expect(res.isViolated).toBeFalsy();
      });
      util.testObjectLevelRules(zipCode, '51123-1234', function(res) {
        expect(res.isViolated).toBeFalsy();
      });
      util.testObjectLevelRules(zipCode, '   ', function(res) {
        expect(res.isViolated).toBeFalsy();
      });
    });

  });

  describe('Valid URL Rule Test', function() {
    var validUrl = require('../../../feed-processor/rule/impl/validUrlRule');

    it('Should not crash', function() {
      util.testObjectLevelRules(validUrl, null, function(res) {
        expect(res.isViolated).toBeFalsy();
      });
      util.testObjectLevelRules(validUrl, undefined, function(res) {
        expect(res.isViolated).toBeFalsy();
      })
    });

    it('Should send an error', function() {
      util.testObjectLevelRules(validUrl, 'htttp://blah', function(res) {
        expect(res.isViolated).toBeTruthy();
      });
      util.testObjectLevelRules(validUrl, '    ', function(res) {
        expect(res.isViolated).toBeTruthy();
      });
    });

    it('Should not send an error', function() {
      util.testObjectLevelRules(validUrl, 'https://www.somesite.org', function(res) {
        expect(res.isViolated).toBeFalsy();
      });
      util.testObjectLevelRules(validUrl, 'http://www.somesite.org/bananas/else', function(res) {
        expect(res.isViolated).toBeFalsy();
      });
    });
  });

  describe('Phone Number Rule Test', function() {
    var phoneNumber = require('../../../feed-processor/rule/impl/phoneNumberRule');

    it('Should not crash', function() {
      util.testObjectLevelRules(phoneNumber, null, function(res) {
        expect(res.isViolated).toBeFalsy();
      });
      util.testObjectLevelRules(phoneNumber, undefined, function(res) {
        expect(res.isViolated).toBeFalsy();
      })
    });

    it('Should send an error', function() {
      util.testObjectLevelRules(phoneNumber, '555', function(res) {
        expect(res.isViolated).toBeTruthy();
      });
      util.testObjectLevelRules(phoneNumber, '    ', function(res) {
        expect(res.isViolated).toBeTruthy();
      });
    });

    it('Should not send an error', function() {
      util.testObjectLevelRules(phoneNumber, '515-533-2533', function(res) {
        expect(res.isViolated).toBeFalsy();
      });
    });
  });

  describe('Locality Type Rule Test', function() {
    var possible = ['county','city','town','township','borough','parish','village','region'];
    var localityType = require('../../../feed-processor/rule/impl/localityTypeRule');

    it('Should not crash', function() {
      util.testObjectLevelRules(localityType, null, function(res) {
        expect(res.isViolated).toBeFalsy();
      });
      util.testObjectLevelRules(localityType, undefined, function(res) {
        expect(res.isViolated).toBeFalsy();
      })
    });

    it('Should send an error', function() {
      util.testObjectLevelRules(localityType, 'blarg', function(res) {
        expect(res.isViolated).toBeTruthy();
      });
      util.testObjectLevelRules(localityType, '   ', function(res) {
        expect(res.isViolated).toBeTruthy();
      });
    });

    it('Should not send an error', function() {
      possible.forEach(function(loc) {
        util.testObjectLevelRules(localityType, loc, function(res) {
          expect(res.isViolated).toBeFalsy();
        });
      });
    });
  });

  describe('Email Format Rule Test', function() {
    var emailFormat = require('../../../feed-processor/rule/impl/emailFormatRule');

    it('Should not crash', function() {
      util.testObjectLevelRules(emailFormat, null, function(res) {
        expect(res.isViolated).toBeFalsy();
      });
      util.testObjectLevelRules(emailFormat, undefined, function(res) {
        expect(res.isViolated).toBeFalsy();
      })
    });

    it('Should send an error', function() {
      util.testObjectLevelRules(emailFormat, 'something@slssdf', function(res) {
        expect(res.isViolated).toBeTruthy();
      });
      util.testObjectLevelRules(emailFormat, '    ', function(res) {
        expect(res.isViolated).toBeTruthy();
      });
    });

    it('Should not send an error', function() {
      util.testObjectLevelRules(emailFormat, 'email@awesome.com', function(res) {
        expect(res.isViolated).toBeFalsy();
      });
    });
  });

});