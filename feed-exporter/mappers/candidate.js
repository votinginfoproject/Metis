/**
 * Created by rcartier13 on 3/5/14.
 */

var schemas = require('../../dao/schemas');
var addrEx = require('./address');

function candidateExport(feedId, writer, receiver, namespace, callback) {
  schemas.models.Candidate.find({_feed: feedId}, function(err, results) {
    var candidate = writer.declareElement(namespace, 'candidate');
    var name = writer.declareElement(namespace, 'name');
    var party = writer.declareElement(namespace, 'party');
    var candidateUrl = writer.declareElement(namespace, 'candidate_url');
    var biography = writer.declareElement(namespace, 'biography');
    var phone = writer.declareElement(namespace, 'phone');
    var photoUrl = writer.declareElement(namespace, 'photo_url');
    var address = writer.declareElement(namespace, 'filed_mailing_address');
    var email = writer.declareElement(namespace, 'email');
    var sortOrder = writer.declareElement(namespace, 'sort_order');

    var idAttr = writer.declareAttribute('id');

    if(!results.length)
      return;

    results.forEach(function(result) {
      receiver = receiver.startElement(candidate).addAttribute(idAttr, result.elementId.toString());

      if(result.name)
        receiver = receiver.startElement(name).addText(result.name).endElement();
      if(result.party)
        receiver = receiver.startElement(party).addText(result.party).endElement();
      if(result.candidateUrl)
        receiver = receiver.startElement(candidateUrl).addText(result.candidateUrl).endElement();
      if(result.biography)
        receiver = receiver.startElement(biography).addText(result.biography).endElement();
      if(result.phone)
        receiver = receiver.startElement(phone).addText(result.phone).endElement();
      if(result.photoUrl)
        receiver = receiver.startElement(photoUrl).addText(result.photoUrl).endElement();
      if(result.filedMailingAddress)
        addrEx.addressExport(receiver, writer, namespace, address, result.filedMailingAddress);
      if(result.email)
        receiver = receiver.startElement(email).addText(result.email).endElement();
      if(result.sortOrder)
        receiver = receiver.startElement(sortOrder).addText(result.sortOrder.toString()).endElement();

      receiver = receiver = receiver.endElement();
    });

    console.log('candidate finished');
    callback();
  });
}

exports.candidateExport = candidateExport;