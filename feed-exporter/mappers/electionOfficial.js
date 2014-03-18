/**
 * Created by rcartier13 on 3/5/14.
 */

var schemas = require('../../dao/schemas');
var util = require('./util');
var _ = require('underscore');
var pd = require('pretty-data').pd;

function electionOfficialExport(feedId, callback) {
  schemas.models.ElectionOfficial.find({_feed: feedId}, function(err, results) {

    if(!results.length)
      callback(-1);

    results.forEach(function(result) {
      var chunk = util.startElement('election_official', 'id', _.escape(result.elementId.toString()), null, null);

      if(result.name)
        chunk += util.startEndElement('name', _.escape(result.name));
      if(result.title)
        chunk += util.startEndElement('title', _.escape(result.title));
      if(result.phone)
        chunk += util.startEndElement('phone', _.escape(result.phone));
      if(result.fax)
        chunk += util.startEndElement('fax', _.escape(result.fax));
      if(result.email)
        chunk += util.startEndElement('email', _.escape(result.email));

      chunk += util.endElement('election_official');
      callback(pd.xml(chunk));
    });

    console.log('election official finished');
  });
}

exports.electionOfficialExport = electionOfficialExport;