/**
 * Created by rcartier13 on 2/17/14.
 */

var util = require('../../../feed-processor/overview/utils');

describe('Overview Utility Tests', function() {

  describe('Count Properties works properly', function() {
    it('Counts the correct number', function() {
      var count = util.countProperties({
        _something: 0,
        _somethingElse: 0,
        sortOrder: 0,
        candidate: 1,
        candidates: 1,
        ballotResponse: 2,
        ballotResponses: 2,
        other: 3,
        thing: 4,
        five: 5,
        obj: {
          one: 6,
          thing: 7
        }
      });

      expect(count).toBe(7);
    });
  });

  describe('Create Overview Object works properly', function() {
    it('Returns zeroed out when nothing is passed in', function() {
      var res = util.createOverviewObject();
      expect(res.amount).toBe(0);
      expect(res.fieldCount).toBe(0);
      expect(res.schemaFieldCount).toBe(0);
    });

    it('Returns the values passed in', function() {
      var res = util.createOverviewObject(1, undefined, 3);
      expect(res.amount).toBe(1);
      expect(res.fieldCount).toBe(0);
      expect(res.schemaFieldCount).toBe(3);
    });
  });

  describe('Add Overview Objects works properly', function() {
    it('Returns the proper sum of the two objects', function() {
      var res = util.addOverviewObjects(util.createOverviewObject(2, 3, 4), util.createOverviewObject(2, 3, 4));
      expect(res.amount).toBe(4);
      expect(res.fieldCount).toBe(6);
      expect(res.schemaFieldCount).toBe(8);
    });
  });

  describe('Reduce Overview Object works properly', function() {
    it('Returns an object with the correct values', function() {
      var res = util.reduceOverviewObject([
        {
          _something: 0,
          sortOrder: 0,
          one: 1,
          two: 2,
          three: 3
        },
        {
          _something: 0,
          one: 1,
          two: 2,
          three: 3,
          four: 4,
          five: 5
        }
      ], 5);

      expect(res.amount).toBe(2);
      expect(res.fieldCount).toBe(8);
      expect(res.schemaFieldCount).toBe(10);
    });
  });
});