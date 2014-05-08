/**
 * Created by nboseman on 2/11/14.
 */

var schemas = require('../../../dao/schemas');
var _s = require('underscore.string');
var when = require('when');


var evaluateUniqueId = function (_feedId, constraintSet, ruleDefinition, callback) {
  var totalErrorCount = 0;

  schemas.models.uniqueid.aggregate()
    .group({
      _id: {
        elementId: '$elementId'
      },

      models: { $push: '$model' },
      refs: { $push: '$ref' },
      count: { $sum: 1 }
    })
    .match({ count: { $gt: 1 } })
    .exec(function (err, results) {

      if (results.length == 0) {
        callback({ isViolated: false, promisedErrorCount: 0 });
        return;
      }

      var promises;
      promises = results.map(function (result) {
        var promise = null;
        result.models.forEach(function (model, index) {
          totalErrorCount++;
          var createProm = schemas.models[model].Error.create({
            severityCode: ruleDefinition.severityCode,
            severityText: ruleDefinition.severityText,
            errorCode: ruleDefinition.errorCode,
            title: ruleDefinition.title,
            details: _s.sprintf('%s.elementId: "%s" is used multiple times.', model, result._id.elementId),
            textualReference: _s.sprintf('id = %s', result._id.elementId),
            refElementId: result._id.elementId,
            _ref: result.refs[index],
            _feed: _feedId
          });

          if (promise) {
            when.join(promise, createProm);
          }
          else {
            promise = createProm;
          }
        });

        return promise;
      });

      when.all(promises).then(function (err) {
        callback({ isViolated: true, promisedErrorCount: totalErrorCount });
      });

      schemas.models.uniqueid.remove({}, function(err) { console.log('uniqueIds removed'); });
    });
};


exports.evaluate = evaluateUniqueId;
