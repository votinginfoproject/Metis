describe('Feed Overview Test', function () {

  describe('Log in', function () {

    // Successful attempt
    //    currently only with local client, need to modify later for crowd
    it('Accepts a proper username + password', function () {
      e2eLogIn('testuser', 'test');
    });
  });

  /* ----------------------------------------
   Feed Overview page
   ------------------------------------------*/
  describe('Check Feed Overview page', function () {
    // check the the number of feeds
    it('Should go to the Feed Overview page after selecting a feed', function () {

      // expect to start out on the feed index page

      // click the first feed
      element('#date0 a').click();

      sleep(testGlobals.sleepTime);

      // should be on the feed overview page
      expect(element('#feed-overview-content').count()).toBe(1);
    });

  });

  /* ----------------------------------------
   Feed Overview polling locations overview modules
   ------------------------------------------*/
  describe('Check Feed Overview polling locations overview module error links', function () {
    // check to make sure each error count matches with the error count when going into the error page for that row

    // the promise to get the error on the module page
    var errorcount = null;
    // the value of the above, via jQuery
    var errorcountVal = null;
    // the promise to get the error on the error page associated with the error link we clicked on
    var errorcount2 = null;

    // Polling Locations Overview Module on the Feed Overview page
    // ===================================================
    // ===================================================
    // ===================================================

    it('Get error numbers - Early Vote Sites', function () {

      errorcount = null;
      errorcountVal = null;
      errorcount2 = null;

      // Early Vote Sites - click link
      errorcount = element('#pollingLocation-errors0 a div').attr('errorvalue');

      element('#pollingLocation-errors0 a div').query(function (selectedElements, done) {
        errorcountVal = selectedElements.attr('errorvalue');
        if(errorcountVal !== "0"){

          element('#pollingLocation-errors0 a').click();
          sleep(testGlobals.sleepTime);

          expect(element("#feeds-overview-earlyvotesites-errors-content").count()).toBe(1);

          errorcount2 = element('#total_errors').attr('errorvalue');
        }

        done();
      });

    });
    it('Should have matching error numbers - Early Vote Sites', function () {
      if(errorcountVal !== "0"){ expect(errorcount).toBe(errorcount2.value); }

      // go back to the overview page
      element('#pageHeader-breadcrumb1 a').click();
      sleep(testGlobals.sleepTime);

    });

    // ===================================================

    it('Get error numbers - Election Admin', function () {

      errorcount = null;
      errorcountVal = null;
      errorcount2 = null;


      // Early Vote Sites - click link
      errorcount = element('#pollingLocation-errors1 a div').attr('errorvalue');

      element('#pollingLocation-errors1 a div').query(function (selectedElements, done) {
        errorcountVal = selectedElements.attr('errorvalue');
        if(errorcountVal !== "0"){

          element('#pollingLocation-errors1 a').click();
          sleep(testGlobals.sleepTime);

          expect(element("#feeds-overview-electionadministrations-errors-content").count()).toBe(1);

          errorcount2 = element('#total_errors').attr('errorvalue');
        }

        done();
      });


    });
    it('Should have matching error numbers - Election Admin', function () {
      if(errorcountVal !== "0"){ expect(errorcount).toBe(errorcount2.value); }

      // go back to the overview page
      element('#pageHeader-breadcrumb1 a').click();
      sleep(testGlobals.sleepTime);
    });

    // ===================================================

    it('Get error numbers - Election Officials', function () {

      errorcount = null;
      errorcountVal = null;
      errorcount2 = null;

      // Early Vote Sites - click link
      errorcount = element('#pollingLocation-errors2 a div').attr('errorvalue');

      element('#pollingLocation-errors2 a div').query(function (selectedElements, done) {
        errorcountVal = selectedElements.attr('errorvalue');
        if(errorcountVal !== "0"){

          element('#pollingLocation-errors2 a').click();
          sleep(testGlobals.sleepTime);

          expect(element("#feeds-overview-electionofficials-errors-content").count()).toBe(1);

          errorcount2 = element('#total_errors').attr('errorvalue');
        }

        done();
      });

    });
    it('Should have matching error numbers - Election Officials', function () {
      if(errorcountVal !== "0"){ expect(errorcount).toBe(errorcount2.value); }

      // go back to the overview page
      element('#pageHeader-breadcrumb1 a').click();
      sleep(testGlobals.sleepTime);
    });

    // ===================================================

    it('Get error numbers - Localities', function () {

      errorcount = null;
      errorcountVal = null;
      errorcount2 = null;


      // Early Vote Sites - click link
      errorcount = element('#pollingLocation-errors3 a div').attr('errorvalue');

      element('#pollingLocation-errors3 a div').query(function (selectedElements, done) {
        errorcountVal = selectedElements.attr('errorvalue');
        if(errorcountVal !== "0"){

          element('#pollingLocation-errors3 a').click();
          sleep(testGlobals.sleepTime);

          expect(element("#feeds-overview-localities-errors-content").count()).toBe(1);

          errorcount2 = element('#total_errors').attr('errorvalue');
        }

        done();
      });


    });
    it('Should have matching error numbers - Localities', function () {
      if(errorcountVal !== "0"){ expect(errorcount).toBe(errorcount2.value); }

      // go back to the overview page
      element('#pageHeader-breadcrumb1 a').click();
      sleep(testGlobals.sleepTime);
    });

    // ===================================================

    it('Get error numbers - Polling Locations', function () {

      errorcount = null;
      errorcountVal = null;
      errorcount2 = null;


      // Early Vote Sites - click link
      errorcount = element('#pollingLocation-errors4 a div').attr('errorvalue');

      element('#pollingLocation-errors4 a div').query(function (selectedElements, done) {
        errorcountVal = selectedElements.attr('errorvalue');
        if(errorcountVal !== "0"){

          element('#pollingLocation-errors4 a').click();
          sleep(testGlobals.sleepTime);

          expect(element("#feeds-overview-pollinglocations-errors-content").count()).toBe(1);

          errorcount2 = element('#total_errors').attr('errorvalue');
        }

        done();
      });

    });
    it('Should have matching error numbers - Polling Locations', function () {
      if(errorcountVal !== "0"){ expect(errorcount).toBe(errorcount2.value); }

      // go back to the overview page
      element('#pageHeader-breadcrumb1 a').click();
      sleep(testGlobals.sleepTime);
    });

    // ===================================================

    it('Get error numbers - Precinct Splits', function () {

      errorcount = null;
      errorcountVal = null;
      errorcount2 = null;


      // Early Vote Sites - click link
      errorcount = element('#pollingLocation-errors5 a div').attr('errorvalue');

      element('#pollingLocation-errors5 a div').query(function (selectedElements, done) {
        errorcountVal = selectedElements.attr('errorvalue');
        if(errorcountVal !== "0"){

          element('#pollingLocation-errors5 a').click();
          sleep(testGlobals.sleepTime);

          expect(element("#feeds-overview-precinctsplits-errors-content").count()).toBe(1);

          errorcount2 = element('#total_errors').attr('errorvalue');
        }

        done();
      });

    });
    it('Should have matching error numbers - Precinct Splits', function () {
      if(errorcountVal !== "0"){ expect(errorcount).toBe(errorcount2.value); }

      // go back to the overview page
      element('#pageHeader-breadcrumb1 a').click();
      sleep(testGlobals.sleepTime);
    });

    // ===================================================

    it('Get error numbers - Precincts', function () {

      errorcount = null;
      errorcountVal = null;
      errorcount2 = null;

      // Early Vote Sites - click link
      errorcount = element('#pollingLocation-errors6 a div').attr('errorvalue');

      element('#pollingLocation-errors6 a div').query(function (selectedElements, done) {
        errorcountVal = selectedElements.attr('errorvalue');
        if(errorcountVal !== "0"){

          element('#pollingLocation-errors6 a').click();
          sleep(testGlobals.sleepTime);

          expect(element("#feeds-overview-precincts-errors-content").count()).toBe(1);

          errorcount2 = element('#total_errors').attr('errorvalue');
        }

        done();
      });

    });
    it('Should have matching error numbers - Precincts', function () {
      if(errorcountVal !== "0"){ expect(errorcount).toBe(errorcount2.value); }

      // go back to the overview page
      element('#pageHeader-breadcrumb1 a').click();
      sleep(testGlobals.sleepTime);
    });

    // ===================================================

    it('Get error numbers - Street Segments', function () {

      errorcount = null;
      errorcountVal = null;
      errorcount2 = null;


      // Early Vote Sites - click link
      errorcount = element('#pollingLocation-errors7 a div').attr('errorvalue');

      element('#pollingLocation-errors7 a div').query(function (selectedElements, done) {
        errorcountVal = selectedElements.attr('errorvalue');
        if(errorcountVal !== "0"){

          element('#pollingLocation-errors7 a').click();
          sleep(testGlobals.sleepTime);

          expect(element("#feeds-overview-streetsegments-errors-content").count()).toBe(1);

          errorcount2 = element('#total_errors').attr('errorvalue');
        }

        done();
      });

    });
    it('Should have matching error numbers - Street Segments', function () {
      if(errorcountVal !== "0"){ expect(errorcount).toBe(errorcount2.value); }

      // go back to the overview page
      element('#pageHeader-breadcrumb1 a').click();
      sleep(testGlobals.sleepTime);
    });

  });

  /* ----------------------------------------
   Feed Overview contests overview modules
   ------------------------------------------*/
  describe('Check Feed Overview contests overview module error links', function () {
    // check to make sure each error count matches with the error count when going into the error page for that row

    // the promise to get the error on the module page
    var errorcount = null;
    // the value of the above, via jQuery
    var errorcountVal = null;
    // the promise to get the error on the error page associated with the error link we clicked on
    var errorcount2 = null;

    it('Get error numbers - Ballots', function () {

      errorcount = null;
      errorcountVal = null;
      errorcount2 = null;

      // Ballots - click link
      errorcount = element('#feedContests-errors0 a div').attr('errorvalue');

      element('#feedContests-errors0 a div').query(function (selectedElements, done) {
        errorcountVal = selectedElements.attr('errorvalue');
        if(errorcountVal !== "0"){

          element('#feedContests-errors0 a').click();
          sleep(testGlobals.sleepTime);

          expect(element("#feeds-overview-ballots-errors-content").count()).toBe(1);

          errorcount2 = element('#total_errors').attr('errorvalue');
        }

        done();
      });

    });
    it('Should have matching error numbers - Ballots', function () {
      if(errorcountVal !== "0"){ expect(errorcount).toBe(errorcount2.value); }

      // go back to the overview page
      element('#pageHeader-breadcrumb1 a').click();
      sleep(testGlobals.sleepTime);
    });

    // ===================================================

    it('Get error numbers - Candidates', function () {

      errorcount = null;
      errorcountVal = null;
      errorcount2 = null;


      // Ballots - click link
      errorcount = element('#feedContests-errors1 a div').attr('errorvalue');

      element('#feedContests-errors1 a div').query(function (selectedElements, done) {
        errorcountVal = selectedElements.attr('errorvalue');
        if(errorcountVal !== "0"){

          element('#feedContests-errors1 a').click();
          sleep(testGlobals.sleepTime);

          expect(element("#feeds-overview-candidates-errors-content").count()).toBe(1);

          errorcount2 = element('#total_errors').attr('errorvalue');
        }

        done();
      });


    });
    it('Should have matching error numbers - Candidates', function () {
      if(errorcountVal !== "0"){ expect(errorcount).toBe(errorcount2.value); }

      // go back to the overview page
      element('#pageHeader-breadcrumb1 a').click();
      sleep(testGlobals.sleepTime);
    });

    // ===================================================

    it('Get error numbers - Contests', function () {

      errorcount = null;
      errorcountVal = null;
      errorcount2 = null;


      // Ballots - click link
      errorcount = element('#feedContests-errors2 a div').attr('errorvalue');

      element('#feedContests-errors2 a div').query(function (selectedElements, done) {
        errorcountVal = selectedElements.attr('errorvalue');
        if(errorcountVal !== "0"){

          element('#feedContests-errors2 a').click();
          sleep(testGlobals.sleepTime);

          expect(element("#feeds-overview-contests-errors-content").count()).toBe(1);

          errorcount2 = element('#total_errors').attr('errorvalue');
        }

        done();
      });

    });
    it('Should have matching error numbers - Contests', function () {
      if(errorcountVal !== "0"){ expect(errorcount).toBe(errorcount2.value); }

      // go back to the overview page
      element('#pageHeader-breadcrumb1 a').click();
      sleep(testGlobals.sleepTime);
    });

    // ===================================================

    it('Get error numbers - Electoral Districts', function () {

      errorcount = null;
      errorcountVal = null;
      errorcount2 = null;


      // Ballots - click link
      errorcount = element('#feedContests-errors3 a div').attr('errorvalue');

      element('#feedContests-errors3 a div').query(function (selectedElements, done) {
        errorcountVal = selectedElements.attr('errorvalue');
        if(errorcountVal !== "0"){

          element('#feedContests-errors3 a').click();
          sleep(testGlobals.sleepTime);

          expect(element("#feeds-overview-electoraldistricts-errors-content").count()).toBe(1);

          errorcount2 = element('#total_errors').attr('errorvalue');
        }

        done();
      });

    });
    it('Should have matching error numbers - Electoral Districts', function () {
      if(errorcountVal !== "0"){ expect(errorcount).toBe(errorcount2.value); }

      // go back to the overview page
      element('#pageHeader-breadcrumb1 a').click();
      sleep(testGlobals.sleepTime);
    });

    // ===================================================

    it('Get error numbers - Referenda', function () {

      errorcount = null;
      errorcountVal = null;
      errorcount2 = null;

      // Ballots - click link
      errorcount = element('#feedContests-errors4 a div').attr('errorvalue');

      element('#feedContests-errors4 a div').query(function (selectedElements, done) {
        errorcountVal = selectedElements.attr('errorvalue');
        if(errorcountVal !== "0"){

          element('#feedContests-errors4 a').click();
          sleep(testGlobals.sleepTime);

          expect(element("#feeds-overview-referenda-errors-content").count()).toBe(1);

          errorcount2 = element('#total_errors').attr('errorvalue');
        }

        done();
      });

    });
    it('Should have matching error numbers - Referenda', function () {
      if(errorcountVal !== "0"){ expect(errorcount).toBe(errorcount2.value); }

      // go back to the overview page
      element('#pageHeader-breadcrumb1 a').click();
      sleep(testGlobals.sleepTime);
    });

  });

  /* ----------------------------------------
   Contest overview modules
   ------------------------------------------*/
  describe('Check Contest overview module error links', function () {
    // check to make sure each error count matches with the error count when going into the error page for that row

    // the promise to get the error on the module page
    var errorcount = null;
    // the value of the above, via jQuery
    var errorcountVal = null;
    // the promise to get the error on the error page associated with the error link we clicked on
    var errorcount2 = null;

    it('Go to the first Contest', function () {

      // go to the contests page
      element('#sidebar-contests').click();
      sleep(testGlobals.sleepTime);

      // go to the first contest
      element('#contests-id0 a').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed contest page
      expect(element('#feed-contest-content').count()).toBe(1);
    });

    // ===================================================

    it('Get error numbers - Ballot under a Contest', function () {

      errorcount = null;
      errorcountVal = null;
      errorcount2 = null;

      // Ballots - click link
      errorcount = element('#contestOverview-errors0 a div').attr('errorvalue');

      element('#contestOverview-errors0 a div').query(function (selectedElements, done) {
        errorcountVal = selectedElements.attr('errorvalue');
        if(errorcountVal !== "0"){

          element('#contestOverview-errors0 a').click();
          sleep(testGlobals.sleepTime);

          expect(element("#feeds-election-contests-overview-ballot-errors-content").count()).toBe(1);

          errorcount2 = element('#total_errors').attr('errorvalue');
        }

        done();
      });

    });
    it('Should have matching error numbers - Ballot under a Contest', function () {
      if(errorcountVal !== "0"){ expect(errorcount).toBe(errorcount2.value); }

      // go back to the contest page
      element('#pageHeader-breadcrumb4 a').click();
      sleep(testGlobals.sleepTime);
    });

    // ===================================================
    it('Get error numbers - Candidates under a Contest', function () {

      errorcount = null;
      errorcountVal = null;
      errorcount2 = null;

      // Ballots - click link
      errorcount = element('#contestOverview-errors1 a div').attr('errorvalue');

      element('#contestOverview-errors1 a div').query(function (selectedElements, done) {
        errorcountVal = selectedElements.attr('errorvalue');
        if(errorcountVal !== "0"){

          element('#contestOverview-errors1 a').click();
          sleep(testGlobals.sleepTime);

          expect(element("#feeds-election-contests-overview-candidates-errors-content").count()).toBe(1);

          errorcount2 = element('#total_errors').attr('errorvalue');
        }

        done();
      });

    });
    it('Should have matching error numbers - Candidates under a Contest', function () {
      if(errorcountVal !== "0"){ expect(errorcount).toBe(errorcount2.value); }

      // go back to the contest page
      element('#pageHeader-breadcrumb4 a').click();
      sleep(testGlobals.sleepTime);
    });

    // ===================================================

    it('Get error numbers - Electoral District under a Contest', function () {

      errorcount = null;
      errorcountVal = null;
      errorcount2 = null;

      // Ballots - click link
      errorcount = element('#contestOverview-errors2 a div').attr('errorvalue');

      element('#contestOverview-errors2 a div').query(function (selectedElements, done) {
        errorcountVal = selectedElements.attr('errorvalue');
        if(errorcountVal !== "0"){

          element('#contestOverview-errors2 a').click();
          sleep(testGlobals.sleepTime);

          expect(element("#feeds-election-contests-overview-electoraldistrict-errors-content").count()).toBe(1);

          errorcount2 = element('#total_errors').attr('errorvalue');
        }

        done();
      });

    });
    it('Should have matching error numbers - Electoral District under a Contest', function () {
      if(errorcountVal !== "0"){ expect(errorcount).toBe(errorcount2.value); }

      // go back to the contest page
      element('#pageHeader-breadcrumb4 a').click();
      sleep(testGlobals.sleepTime);
    });

    // ===================================================

    it('Get error numbers - Referenda under a Contest', function () {

      errorcount = null;
      errorcountVal = null;
      errorcount2 = null;

      // Ballots - click link
      errorcount = element('#contestOverview-errors3 a div').attr('errorvalue');

      element('#contestOverview-errors3 a div').query(function (selectedElements, done) {
        errorcountVal = selectedElements.attr('errorvalue');
        if(errorcountVal !== "0"){

          element('#contestOverview-errors3 a').click();
          sleep(testGlobals.sleepTime);

          expect(element("#feeds-election-contests-overview-referenda-errors-content").count()).toBe(1);

          errorcount2 = element('#total_errors').attr('errorvalue');
        }

        done();
      });

    });
    it('Should have matching error numbers - Referenda under a Contest', function () {
      if(errorcountVal !== "0"){ expect(errorcount).toBe(errorcount2.value); }

      // go back to the contest page
      element('#pageHeader-breadcrumb4 a').click();
      sleep(testGlobals.sleepTime);
    });

  });

  /* ----------------------------------------
   Locality overview modules
   ------------------------------------------*/
  describe('Check Locality overview module error links', function () {
    // check to make sure each error count matches with the error count when going into the error page for that row

    // the promise to get the error on the module page
    var errorcount = null;
    // the value of the above, via jQuery
    var errorcountVal = null;
    // the promise to get the error on the error page associated with the error link we clicked on
    var errorcount2 = null;

    it('Go to the first Locality', function () {

      // go to the contests page
      element('#sidebar-pollinglocations').click();
      sleep(testGlobals.sleepTime);

      // go to the first locality
      element('#locality-id0 a').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed contest page
      expect(element('#feed-locality-content').count()).toBe(1);
    });

    // ===================================================

    it('Get error numbers - Early Vote Sites under a Locality', function () {

      errorcount = null;
      errorcountVal = null;
      errorcount2 = null;

      // Ballots - click link
      errorcount = element('#locality-errors0 a div').attr('errorvalue');

      element('#locality-errors0 a div').query(function (selectedElements, done) {
        errorcountVal = selectedElements.attr('errorvalue');
        if(errorcountVal !== "0"){

          element('#locality-errors0 a').click();
          sleep(testGlobals.sleepTime);

          expect(element("#feeds-election-state-localities-overview-earlyvotesites-errors-content").count()).toBe(1);

          errorcount2 = element('#total_errors').attr('errorvalue');
        }

        done();
      });

    });
    it('Should have matching error numbers - Early Vote Sites under a Locality', function () {
      if(errorcountVal !== "0"){ expect(errorcount).toBe(errorcount2.value); }

      // go back to the locality page
      element('#pageHeader-breadcrumb5 a').click();
      sleep(testGlobals.sleepTime);
    });

    // ===================================================

    it('Get error numbers - Election Admin under a Locality', function () {

      errorcount = null;
      errorcountVal = null;
      errorcount2 = null;

      // Ballots - click link
      errorcount = element('#locality-errors1 a div').attr('errorvalue');

      element('#locality-errors1 a div').query(function (selectedElements, done) {
        errorcountVal = selectedElements.attr('errorvalue');
        if(errorcountVal !== "0"){

          element('#locality-errors1 a').click();
          sleep(testGlobals.sleepTime);

          expect(element("#feeds-election-state-localities-overview-electionadministration-errors-content").count()).toBe(1);

          errorcount2 = element('#total_errors').attr('errorvalue');
        }

        done();
      });

    });
    it('Should have matching error numbers - Election Admin under a Locality', function () {
      if(errorcountVal !== "0"){ expect(errorcount).toBe(errorcount2.value); }

      // go back to the locality page
      element('#pageHeader-breadcrumb5 a').click();
      sleep(testGlobals.sleepTime);
    });

    // ===================================================

    it('Get error numbers - Polling Locations under a Locality', function () {

      errorcount = null;
      errorcountVal = null;
      errorcount2 = null;

      // Ballots - click link
      errorcount = element('#locality-errors2 a div').attr('errorvalue');

      element('#locality-errors2 a div').query(function (selectedElements, done) {
        errorcountVal = selectedElements.attr('errorvalue');
        if(errorcountVal !== "0"){

          element('#locality-errors2 a').click();
          sleep(testGlobals.sleepTime);

          expect(element("#feeds-election-state-localities-overview-pollinglocations-errors-content").count()).toBe(1);

          errorcount2 = element('#total_errors').attr('errorvalue');
        }

        done();
      });

    });
    it('Should have matching error numbers - Polling Locations under a Locality', function () {
      if(errorcountVal !== "0"){ expect(errorcount).toBe(errorcount2.value); }

      // go back to the locality page
      element('#pageHeader-breadcrumb5 a').click();
      sleep(testGlobals.sleepTime);
    });

    // ===================================================

    it('Get error numbers - Precinct Splits under a Locality', function () {

      errorcount = null;
      errorcountVal = null;
      errorcount2 = null;

      // Ballots - click link
      errorcount = element('#locality-errors3 a div').attr('errorvalue');

      element('#locality-errors3 a div').query(function (selectedElements, done) {
        errorcountVal = selectedElements.attr('errorvalue');
        if(errorcountVal !== "0"){

          element('#locality-errors3 a').click();
          sleep(testGlobals.sleepTime);

          expect(element("#feeds-election-state-localities-overview-precinctsplits-errors-content").count()).toBe(1);

          errorcount2 = element('#total_errors').attr('errorvalue');
        }

        done();
      });

    });
    it('Should have matching error numbers - Precinct Splits under a Locality', function () {
      if(errorcountVal !== "0"){ expect(errorcount).toBe(errorcount2.value); }

      // go back to the locality page
      element('#pageHeader-breadcrumb5 a').click();
      sleep(testGlobals.sleepTime);
    });

    // ===================================================

    it('Get error numbers - Precincts under a Locality', function () {

      errorcount = null;
      errorcountVal = null;
      errorcount2 = null;

      // Ballots - click link
      errorcount = element('#locality-errors4 a div').attr('errorvalue');

      element('#locality-errors4 a div').query(function (selectedElements, done) {
        errorcountVal = selectedElements.attr('errorvalue');
        if(errorcountVal !== "0"){

          element('#locality-errors4 a').click();
          sleep(testGlobals.sleepTime);

          expect(element("#feeds-election-state-localities-overview-precincts-errors-content").count()).toBe(1);

          errorcount2 = element('#total_errors').attr('errorvalue');
        }

        done();
      });

    });
    it('Should have matching error numbers - Precincts under a Locality', function () {
      if(errorcountVal !== "0"){ expect(errorcount).toBe(errorcount2.value); }

      // go back to the locality page
      element('#pageHeader-breadcrumb5 a').click();
      sleep(testGlobals.sleepTime);
    });

    // ===================================================

    it('Get error numbers - Street Segments under a Locality', function () {

      errorcount = null;
      errorcountVal = null;
      errorcount2 = null;

      // Ballots - click link
      errorcount = element('#locality-errors5 a div').attr('errorvalue');

      element('#locality-errors5 a div').query(function (selectedElements, done) {
        errorcountVal = selectedElements.attr('errorvalue');
        if(errorcountVal !== "0"){

          element('#locality-errors5 a').click();
          sleep(testGlobals.sleepTime);

          expect(element("#feeds-election-state-localities-overview-streetsegments-errors-content").count()).toBe(1);

          errorcount2 = element('#total_errors').attr('errorvalue');
        }

        done();
      });

    });
    it('Should have matching error numbers - Street Segments under a Locality', function () {
      if(errorcountVal !== "0"){ expect(errorcount).toBe(errorcount2.value); }

      // go back to the locality page
      element('#pageHeader-breadcrumb5 a').click();
      sleep(testGlobals.sleepTime);
    });

    // ===================================================


  });

  /* ----------------------------------------
   Log Out
   ------------------------------------------*/
  describe('Logging out', function () {
    // Signs out of the application
    it('Sign out of the app', function () {
      e2eLogOut();
    });
  });
});