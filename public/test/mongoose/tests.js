/**
 * Created by rcartier13 on 12/31/13.
 */

var metisTests = {

  ballotTest: function (models, template, callback) {
    models.Ballot.find({}, function (err, foundVal) {
      var isPassing = true;
      if (err || foundVal[0].elementId !== template.elementId || foundVal[0].writeIn !== template.writeIn)
        isPassing = false;
      callback('Ballot Schema Test', isPassing);
    });
  },

  ballotResponseTest: function (models, template, callback) {
    models.BallotResponse.find({}, function (err, foundVal) {
      var isPassing = true;
      if (err || foundVal[0].elementId !== template.elementId || foundVal[0].sortOrder !== template.sortOrder)
        isPassing = false;
      callback('Ballot Response Schema Test', isPassing);
    });
  },

  ballotLineResultTest: function (models, template, callback) {
    models.BallotLineResult.find({}, function (err, foundVal) {
      var isPassing = true;
      if (err || foundVal[0].elementId !== template.elementId || foundVal[0].certification !== template.certification)
        isPassing = false;
      callback('Ballot Line Result Schema Test', isPassing);
    });
  },

  candidateTest: function (models, template, callback) {
    models.Candidate.find({}, function (err, foundVal) {
      var isPassing = true;
      if (err || foundVal[0].elementId !== template.elementId || foundVal[0].type !== template.type )
        isPassing = false;
      callback('Candidate Schema Test', isPassing);
    });
  },

  contestTest: function (models, template, callback) {
    models.Contest.find({}, function (err, foundVal) {
      var isPassing = true;
      if(err || foundVal[0].elementId !== template.elementId || foundVal[0].type !== template.type)
        isPassing = false;
      callback('Contest Schema Test', isPassing);
    });
  },

  contestResultTest: function (models, template, callback) {
    models.ContestResult.find({}, function (err, foundVal) {
      var isPassing = true;
      if(err || foundVal[0].elementId !== template.elementId || foundVal[0].certification !== template.certification)
        isPassing = false;
      callback('Contest Result Schema Test', isPassing);
    });
  },

  customBallotTest: function (models, template, callback) {
    models.CustomBallot.find({}, function (err, foundVal) {
      var isPassing = true;
      if(err || foundVal[0].elementId !== template.elementId || foundVal[0].ballotResponse.sortOrder !== template.ballotResponse.sortOrder)
        isPassing = false;
      callback('Custom Ballot Schema Test', isPassing);
    });
  },

  earlyVoteSiteTest: function (models, template, callback) {
    models.EarlyVoteSite.find({}, function (err, foundVal) {
      var isPassing = true;
      if(err || foundVal[0].elementId !== template.elementId)
        isPassing = false;
      callback('Early Vote Site Schema Test', isPassing);
    });
  },

  electionTest: function (models, template, callback) {
    models.Election.find({}, function (err, foundVal) {
      var isPassing = true;
      if(err || foundVal[0].elementId !== template.elementId || foundVal[0].pollingHours !== template.pollingHours)
        isPassing = false;
      callback('Election Schema Test', isPassing);
    });
  },

  electionAdminTest: function (models, template, callback) {
    models.ElectionAdmin.find({}, function (err, foundVal) {
      var isPassing = true;
      if(err || foundVal[0].elementId !== template.elementId || foundVal[0].absenteeUrl !== template.absenteeUrl)
        isPassing = false;
      callback('Election Admin Schema Test', isPassing);
    });
  },

  electionOfficialTest: function (models, template, callback) {
    models.ElectionOfficial.find({}, function (err, foundVal) {
      var isPassing = true;
      if(err || foundVal[0].elementId !== template.elementId || foundVal[0].email !== template.email)
        isPassing = false;
      callback('Election Official Schema Test', isPassing);
    });
  },

  electoralDistrictTest: function (models, template, callback) {
    models.ElectoralDistrict.find({}, function (err, foundVal) {
      var isPassing = true;
      if(err || foundVal[0].elementId !== template.elementId || foundVal[0].type !== template.type)
        isPassing = false;
      callback('Electoral District Schema Test', isPassing);
    });
  },

  feedTest: function (models, template, callback) {
    models.Feed.find({}, function (err, foundVal) {
      var isPassing = true;
    if(err || foundVal[0].feedStatus !== template.feedStatus)
      isPassing = false;
    callback('Feed Schema Test', isPassing);
  });
},

localityTest: function (models, template, callback) {
    models.Locality.find({}, function (err, foundVal) {
      var isPassing = true;
      if(err || foundVal[0].elementId !== template.elementId || foundVal[0].stateId !== template.stateId)
        isPassing = false;
      callback('Locality Schema Test', isPassing);
    });
  },

  pollingLocationTest: function (models, template, callback) {
    models.PollingLocation.find({}, function (err, foundVal) {
      var isPassing = true;
      if(err || foundVal[0].elementId !== template.elementId || foundVal[0].pollingHours !== template.pollingHours)
        isPassing = false;
      callback('Polling Location Schema Test', isPassing);
    });
  },

  precinctTest: function (models, template, callback) {
    models.Precinct.find({}, function (err, foundVal) {
      var isPassing = true;
      if (err || foundVal[0].elementId !== template.elementId || foundVal[0].ward !== template.ward)
        isPassing = false;
      callback('Precinct Schema Test', isPassing);
    });
  },

  precinctSplitTest: function (models, template, callback) {
    models.PrecinctSplit.find({}, function (err, foundVal) {
      var isPassing = true;
      if(err || foundVal[0].elementId !== template.elementId || foundVal[0].precinctId !== template.precinctId)
        isPassing = false;
      callback('Precinct Split Schema Test', isPassing);
    });
  },

  referendumTest: function (models, template, callback) {
    models.Referendum.find({}, function (err, foundVal) {
      var isPassing = true;
      if(err || foundVal[0].elementId !== template.elementId || foundVal[0].passageThreshold !== template.passageThreshold)
        isPassing = false;
      callback('Referendum Schema Test', isPassing);
    });
  },

  sourceTest: function (models, template, callback) {
    models.Source.find({}, function (err, foundVal) {
      var isPassing = true;
      if(err || foundVal[0].elementId !== template.elementId || foundVal[0].touUrl !== template.touUrl)
        isPassing = false;
      callback('Source Schema Test', isPassing);
    });
  },

  stateTest: function (models, template, callback) {
    models.State.find({}, function (err, foundVal) {
      var isPassing = true;
      if(err || foundVal[0].elementId !== template.elementId || foundVal[0].earlyVoteSiteIds[0] !== template.earlyVoteSiteIds[0])
        isPassing = false;
      callback('State Schema Test', isPassing);
    });
  },

  streetSegmentTest: function (models, template, callback) {
    models.StreetSegment.find({}, function (err, foundVal) {
      var isPassing = true;
      console.log(err);
      if(err || foundVal[0].elementId !== template.elementId || foundVal[0].nonHouseAddress.apartment !== template.nonHouseAddress.apartment)
        isPassing = false;
      callback('Street Schema Test', isPassing);
    });
  }
};

module.exports = metisTests;