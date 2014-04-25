/**
 * Created by bantonides on 1/29/14.
 */
var _path = require('path');

function mapState(path, state) {
  if (state) {
    return {
      id: state.elementId,
      name: state.name,
      self: _path.join(path, '../../../state')
    };
  } else { return null; }
}

function mapLocality(path, locality) {
  if (locality) {
    return {
      id: locality.elementId,
      name: locality.name,
      self: _path.join(path, '../../../state/localities/', locality.elementId.toString())
    };
  } else { return null; }
}

function mapPrecinct(path, precinct) {
  if (precinct) {
    return {
      id: precinct.elementId,
      name: precinct.name,
      self: _path.join(path, '../../../state/localities/', precinct.localityId.toString(), 'precincts', precinct.elementId.toString())
    };
  } else { return null; }
}

function mapPrecinctSplit(path, split) {
  if (split) {
    return {
      id: split.elementId,
      name: split.name,
      self: _path.join(path, '../../../state/localities/', split._precinct.localityId.toString(), '/precincts', split.precinctId.toString(), 'precinctsplits', split.elementId.toString())
    };
  } else { return null; }
}

function mapElectoralDistrict(path, district) {
  if (district) {
    return {
      id: district.elementId,
      name: district.name,
      self: _path.join(path, '../electoraldistrict')
    }
  } else { return null; }
}

function mapContestSummary(path, contest) {
  return contest ? {
    id: contest.elementId,
    type: contest.type,
    office: contest.office,
    self: _path.join(path, '..')
  } : null;
}

function mapCandidateSummary(path, candidate) {
  return candidate ? {
    id: candidate.elementId,
    name: candidate.name,
    party: candidate.party,
    self: _path.join(path, '../../ballot/candidates/', candidate.elementId.toString())
  } : null;
}

function mapContestResult(path, contestResult) {
  return {
    id: contestResult.elementId,
    error_count: contestResult.errorCount,
    errors: _path.join(path, '/errors'),
    entire_district: contestResult.entireDistrict,
    total_votes: contestResult.totalVotes,
    total_valid_votes: contestResult.totalValidVotes,
    overvotes: contestResult.overvotes,
    blank_votes: contestResult.blankVotes,
    accepted_provisional_votes: contestResult.acceptedProvisionalVotes,
    rejected_votes: contestResult.rejectedVotes,
    certification: contestResult.certification,
    contest: mapContestSummary(path, contestResult._contest),
    vote_type: contestResult.voteType,
    machine_id: contestResult.machineId,
    jurisdiction: mapState(path, contestResult._state) || mapLocality(path, contestResult._locality) ||
      mapPrecinct(path, contestResult._precinct) || mapPrecinctSplit(path, contestResult._precinctSplit) ||
      mapElectoralDistrict(path, contestResult._electoralDistrict)
  };
}

function mapResultsContestResults(path, contestResult) {
  return {
    id: contestResult.elementId,
    office: contestResult._contest.office,
    self: _path.join(path, "../../contests/", contestResult.contestId.toString(), "contestresult"),
    jurisdiction: mapState(path, contestResult._state) || mapLocality(path, contestResult._locality) ||
      mapPrecinct(path, contestResult._precinct) || mapPrecinctSplit(path, contestResult._precinctSplit) ||
      mapElectoralDistrict(path, contestResult._electoralDistrict),
    certification: contestResult.certification
  };
}

function mapResultsBallotLineResults(path, ballotLineResult) {
  console.dir(ballotLineResult);

  return {
    id: ballotLineResult.elementId,
    office: ballotLineResult._contest.office,
    self: _path.join(path, "../../contests/", ballotLineResult.contestId.toString(), "ballotlineresults", ballotLineResult.elementId.toString() ),
    jurisdiction: mapState(path, ballotLineResult._state) || mapLocality(path, ballotLineResult._locality) ||
      mapPrecinct(path, ballotLineResult._precinct) || mapPrecinctSplit(path, ballotLineResult._precinctSplit) ||
      mapElectoralDistrict(path, ballotLineResult._electoralDistrict),
    candidate: (ballotLineResult._candidate ? ballotLineResult._candidate.name : ""),
    vote_type: ballotLineResult.voteType
  }
}


function mapBallotLineResultSummary(path, blr) {
  return {
    id: blr.elementId,
    candidate_id: blr.candidateId,
    response_id: blr.ballotResponseId,
    votes: blr.votes,
    certification: blr.certification,
    self: _path.join(path, '/ballotlineresults', blr.elementId.toString())
  };
}

function mapBallotLineResults(path, ballotLineResults) {
  return ballotLineResults.map(mapBallotLineResultSummary.bind(undefined, path));
}

function mapBallotLineResult(path, ballotLineResult) {
  return {
    id: ballotLineResult.elementId,
    error_count: ballotLineResult.errorCount,
    errors: _path.join(path, '/errors'),
    votes: ballotLineResult.votes,
    victorious: ballotLineResult.victorious,
    certification: ballotLineResult.certification,
    response_text: ballotLineResult._ballotResponse ? ballotLineResult._ballotResponse.text : null,
    candidate: mapCandidateSummary(path, ballotLineResult._candidate),
    contest: mapContestSummary(_path.join(path, '..'), ballotLineResult._contest),
    jurisdiction: mapState(path, ballotLineResult._state) || mapLocality(path, ballotLineResult._locality) ||
      mapPrecinct(path, ballotLineResult._precinct) || mapPrecinctSplit(path, ballotLineResult._precinctSplit) ||
      mapElectoralDistrict(_path.join(path, '..'), ballotLineResult._electoralDistrict)
  };
}

exports.mapResultsContestResults = mapResultsContestResults;
exports.mapResultsBallotLineResults = mapResultsBallotLineResults;
exports.mapContestResult = mapContestResult;
exports.mapBallotLineResults = mapBallotLineResults;
exports.mapBallotLineResult = mapBallotLineResult;
