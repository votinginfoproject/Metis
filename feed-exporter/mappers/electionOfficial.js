/**
 * Created by rcartier13 on 3/5/14.
 */

var schemas = require('../../dao/schemas');

function electionOfficialExport(feedId, writer, receiver, namespace, callback) {
  schemas.models.ElectionOfficial.find({_feed: feedId}, function(err, results) {
    var electionOfficial = writer.declareElement(namespace, 'election_official');
    var name = writer.declareElement(namespace, 'name');
    var title = writer.declareElement(namespace, 'title');
    var phone = writer.declareElement(namespace, 'phone');
    var fax = writer.declareElement(namespace, 'fax');
    var email = writer.declareElement(namespace, 'email');

    var idAttr = writer.declareAttribute('id');

    if(!results.length)
      return;

    results.forEach(function(result) {
      receiver = receiver.startElement(electionOfficial).addAttribute(idAttr, result.elementId.toString());

      if(result.name)
        receiver = receiver.startElement(name).addText(result.name).endElement();
      if(result.title)
        receiver = receiver.startElement(title).addText(result.title).endElement();
      if(result.phone)
        receiver = receiver.startElement(phone).addText(result.phone).endElement();
      if(result.fax)
        receiver = receiver.startElement(fax).addText(result.fax).endElement();
      if(result.email)
        receiver = receiver.startElement(email).addText(result.email).endElement();

      receiver = receiver.endElement();
    });

    console.log('election official finished');
    callback();
  });
}

exports.electionOfficialExport = electionOfficialExport;