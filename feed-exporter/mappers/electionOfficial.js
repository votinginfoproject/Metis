/**
 * Created by rcartier13 on 3/5/14.
 */

var schemas = require('../../dao/schemas');
var util = require('./util');

function electionOfficialExport(feedId, callback) {
  schemas.models.ElectionOfficial.find({_feed: feedId}, function(err, results) {

    if(!results.length)
      callback(-1);

    results.forEach(function(result) {
      var chunk = util.startElement('election_official', 'id', result.elementId.toString(), null, null);

      if(result.name)
        chunk += util.startEndElement('name', result.name);
      if(result.title)
        chunk += util.startEndElement('title', result.title);
      if(result.phone)
        chunk += util.startEndElement('phone', result.phone);
      if(result.fax)
        chunk += util.startEndElement('fax', result.fax);
      if(result.email)
        chunk += util.startEndElement('email', result.email);

      chunk += util.endElement('election_official');
      callback(chunk);
    });

    console.log('election official finished');
  });
}

exports.electionOfficialExport = electionOfficialExport;