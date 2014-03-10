/**
 * Created by rcartier13 on 3/5/14.
 */

var schemas = require('../../dao/schemas');
var addrEx = require('./address');
var util = require('./util');
var _ = require('underscore');

function candidateExport(feedId, callback) {
  schemas.models.Candidate.find({_feed: feedId}, function(err, results) {

    if(!results.length)
      callback(-1);

    results.forEach(function(result) {
      var chunk = util.startElement('candidate', 'id', _.escape(result.elementId.toString()))

      if(result.name)
        chunk += util.startEndElement('name', _.escape(result.name));
      if(result.party)
        chunk += util.startEndElement('party', _.escape(result.party));
      if(result.candidateUrl)
        chunk += util.startEndElement('candidate_url', _.escape(result.candidateUrl));
      if(result.biography)
        chunk += util.startEndElement('biography', _.escape(result.biography));
      if(result.phone)
        chunk += util.startEndElement('phone', _.escape(result.phone));
      if(result.photoUrl)
        chunk += util.startEndElement('photo_url', _.escape(result.photoUrl));
      if(result.filedMailingAddress)
        chunk += addrEx.addressExport('filed_mailing_address', result.filedMailingAddress);
      if(result.email)
        chunk += util.startEndElement('email', _.escape(result.email));
      if(result.sortOrder)
        chunk += util.startEndElement('sort_order', _.escape(result.sortOrder.toString()));

      chunk += util.endElement('candidate');
      callback(chunk);
    });

    console.log('candidate finished');
  });
}

exports.candidateExport = candidateExport;