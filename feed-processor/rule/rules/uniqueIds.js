/**
 * Created by bantonides on 1/22/14.
 */

function check (models, feedId, rule) {
  var when = require('when');

  var idCounts = {};
  var finds = [];

  rule.collections.forEach(function(m) {
    finds.push(models[m].find({ _feed: feedId }).select('elementId').exec());
  });

  when.all(finds).then(function (foundDocs) {
    var docs = Array.prototype.concat.apply([], foundDocs);
    docs.forEach(function (doc) {
      var id = doc.elementId;
      if (idCounts[id] === undefined) {
        idCounts[id] = { count: 0, reference: [] };
      }
      idCounts[id].count++;
      idCounts[id].reference.push(doc.constructor.modelName);
    });
    console.log(Object.keys(idCounts).filter(function(key) {
      return idCounts[key].count > 1;
    }));

  }, function doh (err) {
    console.error(err);
  });
};

exports.runCheck = check;