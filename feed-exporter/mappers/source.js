/**
 * Created by rcartier13 on 3/4/14.
 */

var genx = require('genx');
var db = require('../../dao/db');
var moment = require('moment');

function sourceExport(feedId, writer, receiver, namespace, callback) {
  db.getFeedSource(feedId, function(err, result) {
    var source = writer.declareElement(namespace, 'source');
    var name = writer.declareElement(namespace, 'name');
    var date = writer.declareElement(namespace, 'datetime');
    var desc = writer.declareElement(namespace, 'description');
    var org = writer.declareElement(namespace, 'organization_url');
    var tou = writer.declareElement(namespace, 'touUrl');
    var vipId = writer.declareElement(namespace, 'vip_id');
    var feedContactId = writer.declareElement(namespace, 'feed_contact_id');

    var idAttr = writer.declareAttribute('id');
    if(!result)
      return;

    receiver = receiver.startElement(source).addAttribute(idAttr, result.elementId.toString());

    if(result.name)
      receiver = receiver.startElement(name).addText(result.name).endElement();
    if(result.datetime)
      receiver = receiver.startElement(date).addText(moment(result.datetime).utc().format('YYYY-MM-DD[T]HH:mm:ss')).endElement();
    if(result.description)
      receiver = receiver.startElement(desc).addText(result.description).endElement();
    if(result.organizationUrl)
      receiver = receiver.startElement(org).addText(result.organizationUrl).endElement();
    if(result.touUrl)
      receiver = receiver.startElement(tou).addText(result.touUrl).endElement();
    if(result.vipId)
      receiver = receiver.startElement(vipId).addText(result.vipId.toString()).endElement();
    if(result.feedContactId)
      receiver = receiver.startElement(feedContactId).addText(result.feedContactId.toString()).endElement();

    receiver = receiver.endElement();

    console.log('source finished');
    callback();
  });
}

exports.sourceExport = sourceExport;