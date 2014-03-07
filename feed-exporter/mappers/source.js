/**
 * Created by rcartier13 on 3/4/14.
 */

var db = require('../../dao/db');
var moment = require('moment');
var util = require('./util');

function sourceExport(feedId, callback) {
  db.getFeedSource(feedId, function(err, result) {

    if(!result) {
      callback(-1);
      return;
    }

    var chunk = util.startElement('source', 'id', result.elementId.toString());

    if(result.name)
      chunk += util.startEndElement('name', result.name);
    if(result.datetime)
      chunk += util.startEndElement('date_time', moment(result.datetime).utc().format('YYYY-MM-DD[T]HH:mm:ss'));
    if(result.description)
      chunk += util.startEndElement('description', result.description);
    if(result.organizationUrl)
      chunk += util.startEndElement('organization_url', result.organizationUrl);
    if(result.touUrl)
      chunk += util.startEndElement('tou_url', result.touUrl);
    if(result.vipId)
      chunk += util.startEndElement('vip_id', result.vipId.toString());
    if(result.feedContactId)
      chunk += util.startEndElement('feed_contact_id', result.feedContactId.toString());

    chunk += util.endElement('source');

    console.log('source finished');
    callback(chunk);
  });
}

exports.sourceExport = sourceExport;