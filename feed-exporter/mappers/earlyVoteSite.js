/**
 * Created by rcartier13 on 3/4/14.
 */

var genx = require('genx');
var db = require('../../dao/db');
var schemas = require('../../dao/schemas');
var addrEx = require('./address');
var moment = require('moment');

function earlyVoteSitesExport(feedId, writer, receiver, namespace, callback) {

  schemas.models.EarlyVoteSite.find({_feed: feedId}, function(err, results) {
    var evs = writer.declareElement(namespace, 'early_vote_site');
    var name = writer.declareElement(namespace, 'name');
    var address = writer.declareElement(namespace, 'address');
    var directions = writer.declareElement(namespace, 'directions');
    var voterServices = writer.declareElement(namespace, 'voter_services');
    var startDate = writer.declareElement(namespace, 'start_date');
    var endDate = writer.declareElement(namespace, 'end_date');
    var daysTimesOpen = writer.declareElement(namespace, 'days_times_open');

    var idAttr = writer.declareAttribute('id');

    if(!results.length)
      return;

    results.forEach(function(result) {
      receiver = receiver.startElement(evs).addAttribute(idAttr, result.elementId.toString());

      if(result.name)
        receiver = receiver.startElement(name).addText(result.name).endElement();
      if(result.address)
        addrEx.addressExport(receiver, writer, namespace, address, result.address);
      if(result.directions)
        receiver = receiver.startElement(directions).addText(result.directions).endElement();
      if(result.voterServices)
        receiver = receiver.startElement(voterServices).addText(result.voterServices).endElement();
      if(result.startDate)
        receiver = receiver.startElement(startDate).addText(moment(result.startDate).utc().format('YYYY-MM-DD')).endElement();
      if(result.endDate)
        receiver = receiver.startElement(endDate).addText(moment(result.endDate).utc().format('YYYY-MM-DD')).endElement();
      if(result.daysTimesOpen)
        receiver = receiver.startElement(daysTimesOpen).addText(result.daysTimesOpen).endElement();

      receiver = receiver.endElement();
    });
  });

  console.log('early vote site finished');
  callback();
}

exports.earlyVoteSitesExport = earlyVoteSitesExport;