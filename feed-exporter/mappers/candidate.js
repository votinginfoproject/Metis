/**
 * Created by rcartier13 on 3/5/14.
 */

var schemas = require('../../dao/schemas');
var addrEx = require('./address');
var util = require('./util');

function candidateExport(feedId, callback) {
  schemas.models.Candidate.find({_feed: feedId}, function(err, results) {

    if(!results.length)
      callback(-1);

    results.forEach(function(result) {
      var chunk = util.startElement('candidate', 'id', result.elementId.toString())

      if(result.name)
        chunk += util.startEndElement('name', result.name);
      if(result.party)
        chunk += util.startEndElement('party', result.party);
      if(result.candidateUrl)
        chunk += util.startEndElement('candidate_url', result.candidateUrl);
      if(result.biography)
        chunk += util.startEndElement('biography', result.biography);
      if(result.phone)
        chunk += util.startEndElement('phone', result.phone);
      if(result.photoUrl)
        chunk += util.startEndElement('photo_url', result.photoUrl);
      if(result.filedMailingAddress)
        chunk += addrEx.addressExport('filed_mailing_address', result.filedMailingAddress);
      if(result.email)
        chunk += util.startEndElement('email', result.email);
      if(result.sortOrder)
        chunk += util.startEndElement('sort_order', result.sortOrder.toString());

      chunk += util.endElement('candidate');
      callback(chunk);
    });

    console.log('candidate finished');
  });
}

exports.candidateExport = candidateExport;