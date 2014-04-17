/**
 * Created by rcartier13 on 3/4/14.
 */

var schemas = require('../../dao/schemas');
var util = require('./util');
var _ = require('underscore');
var pd = require('pretty-data').pd;

function ballotLineResultExport(feedId, callback) {
  schemas.models.BallotLineResult.find({_feed: feedId}, function(err, results) {

    if(!results.length)
      callback(-1);

    results.forEach(function(result) {
      var chunk = util.startElement('ballot_line_result', 'id', _.escape(result.elementId.toString()), 'certification', _.escape(result.certification));

      if(result.contestId)
        chunk += util.startEndElement('contest_id', _.escape(result.contestId.toString()));
      if(result.jurisdictionId)
        chunk += util.startEndElement('jurisdiction_id', _.escape(result.jurisdictionId.toString()));
      if(result.entireDistrict != undefined && result.entireDistrict != null)
        chunk += util.startEndElement('entire_district', result.entireDistrict ? 'yes' : 'no');
      if(result.candidateId)
        chunk += util.startEndElement('candidate_id', _.escape(result.candidateId.toString()));
      if(result.ballotResponseId)
        chunk += util.startEndElement('ballot_response_id', _.escape(result.ballotResponseId.toString()));
      if(result.votes)
        chunk += util.startEndElement('votes', _.escape(result.votes.toString()));
      if(result.victorious != undefined && result.entireDistrict != null)
        chunk += util.startEndElement('victorious', result.victorious ? 'yes' : 'no');

      chunk += util.endElement('ballot_line_result');
      callback(pd.xml(chunk));
    });

    console.log('ballot line result finished');
  });
}

exports.ballotLineResultExport = ballotLineResultExport;