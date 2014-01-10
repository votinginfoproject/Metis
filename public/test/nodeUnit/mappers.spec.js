/**
 * Created by rcartier13 on 1/8/14.
 */
var mongoose = require('mongoose');

describe('Mapper Unit Tests', function() {

  describe('baseMapper Save tests', function() {
    it('Returns false if undefined', function() {
      var Ballot = require('../../../feed-processor/mappers/Ballot');
      var model = new Ballot(undefined, mongoose.Schema.Types.ObjectId(1));

      var something = model.save(function() {}, function() {});
      expect(something).toBe(false);
    });

    it('Calls the save function', function(done) {
      var Ballot = require('../../../feed-processor/mappers/Ballot');
      var xmls = require('./mockXml');
      var schemas = require('../../../dao/schemas');

      schemas.initSchemas(mongoose);

      var model = new Ballot(schemas.models, mongoose.Schema.Types.ObjectId(1));
      var isPassing = false;
      model.mapXml3_0(xmls.ballotXML);

      model.model.save = function(cb) { cb(); };
      model.save(function() {}, function() {isPassing = true;});

      waitsFor(function() {
        return isPassing == true;
      }, 5000);

      runs(function() {
        expect(isPassing).toBeTruthy();
        done();
      });
    });
  });
});