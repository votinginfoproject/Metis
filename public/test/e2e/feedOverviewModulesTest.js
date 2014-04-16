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
  describe('Check Feed Overview polling locations overview modules', function () {
    // check to make sure each error count matches with the error count when going into the error page for that row

    var errorcount = null;
    var errorcount2 = null;

    it('Get error numbers - Early Vote Sites', function () {

      errorcount = null;
      errorcount2 = null;

      // Early Vote Sites - click link
      errorcount = element('#pollingLocation-errors0 a div').attr('errorvalue');

      element('#pollingLocation-errors0 a').click();
      sleep(testGlobals.sleepTime);

      expect(element("#feeds-overview-earlyvotesites-errors-content").count()).toBe(1);

      errorcount2 = element('#total_errors').attr('errorvalue');
    });
    it('Should have matching error numbers - Early Vote Sites', function () {
        expect(errorcount).toBe(errorcount2.value);

        // go back to the overview page
        element('#pageHeader-breadcrumb1 a').click();
        sleep(testGlobals.sleepTime);
    });

    // ===================================================

    it('Get error numbers - Election Admin', function () {

      errorcount = null;
      errorcount2 = null;

      // Early Vote Sites - click link
      errorcount = element('#pollingLocation-errors1 a div').attr('errorvalue');

      element('#pollingLocation-errors1 a').click();
      sleep(testGlobals.sleepTime);

      expect(element("#feeds-overview-electionadministrations-errors-content").count()).toBe(1);

      errorcount2 = element('#total_errors').attr('errorvalue');
    });
    it('Should have matching error numbers - Election Admin', function () {
      expect(errorcount).toBe(errorcount2.value);

      // go back to the overview page
      element('#pageHeader-breadcrumb1 a').click();
      sleep(testGlobals.sleepTime);
    });

    // ===================================================

    it('Get error numbers - Election Officials', function () {

      errorcount = null;
      errorcount2 = null;

      // Early Vote Sites - click link
      errorcount = element('#pollingLocation-errors2 a div').attr('errorvalue');

      element('#pollingLocation-errors2 a').click();
      sleep(testGlobals.sleepTime);

      expect(element("#feeds-overview-electionofficials-errors-content").count()).toBe(1);

      errorcount2 = element('#total_errors').attr('errorvalue');
    });
    it('Should have matching error numbers - Election Officials', function () {
      expect(errorcount).toBe(errorcount2.value);

      // go back to the overview page
      element('#pageHeader-breadcrumb1 a').click();
      sleep(testGlobals.sleepTime);
    });

    // ===================================================

    it('Get error numbers - Localities', function () {

      errorcount = null;
      errorcount2 = null;

      // Early Vote Sites - click link
      errorcount = element('#pollingLocation-errors3 a div').attr('errorvalue');

      element('#pollingLocation-errors3 a').click();
      sleep(testGlobals.sleepTime);

      expect(element("#feeds-overview-localities-errors-content").count()).toBe(1);

      errorcount2 = element('#total_errors').attr('errorvalue');
    });
    it('Should have matching error numbers - Localities', function () {
      expect(errorcount).toBe(errorcount2.value);

      // go back to the overview page
      element('#pageHeader-breadcrumb1 a').click();
      sleep(testGlobals.sleepTime);
    });

    // ===================================================

    it('Get error numbers - Polling Locations', function () {

      errorcount = null;
      errorcount2 = null;

      // Early Vote Sites - click link
      errorcount = element('#pollingLocation-errors4 a div').attr('errorvalue');

      element('#pollingLocation-errors4 a').click();
      sleep(testGlobals.sleepTime);

      expect(element("#feeds-overview-pollinglocations-errors-content").count()).toBe(1);

      errorcount2 = element('#total_errors').attr('errorvalue');
    });
    it('Should have matching error numbers - Polling Locations', function () {
      expect(errorcount).toBe(errorcount2.value);

      // go back to the overview page
      element('#pageHeader-breadcrumb1 a').click();
      sleep(testGlobals.sleepTime);
    });

    // ===================================================

    it('Get error numbers - Precinct Splits', function () {

      errorcount = null;
      errorcount2 = null;

      // Early Vote Sites - click link
      errorcount = element('#pollingLocation-errors5 a div').attr('errorvalue');

      element('#pollingLocation-errors5 a').click();
      sleep(testGlobals.sleepTime);

      expect(element("#feeds-overview-precinctsplits-errors-content").count()).toBe(1);

      errorcount2 = element('#total_errors').attr('errorvalue');
    });
    it('Should have matching error numbers - Precinct Splits', function () {
      expect(errorcount).toBe(errorcount2.value);

      // go back to the overview page
      element('#pageHeader-breadcrumb1 a').click();
      sleep(testGlobals.sleepTime);
    });

    // ===================================================

    it('Get error numbers - Precincts', function () {

      errorcount = null;
      errorcount2 = null;

      // Early Vote Sites - click link
      errorcount = element('#pollingLocation-errors6 a div').attr('errorvalue');

      element('#pollingLocation-errors6 a').click();
      sleep(testGlobals.sleepTime);

      expect(element("#feeds-overview-precincts-errors-content").count()).toBe(1);

      errorcount2 = element('#total_errors').attr('errorvalue');
    });
    it('Should have matching error numbers - Precincts', function () {
      expect(errorcount).toBe(errorcount2.value);

      // go back to the overview page
      element('#pageHeader-breadcrumb1 a').click();
      sleep(testGlobals.sleepTime);
    });

    // ===================================================

    it('Get error numbers - Street Segments', function () {

      errorcount = null;
      errorcount2 = null;

      // Early Vote Sites - click link
      errorcount = element('#pollingLocation-errors7 a div').attr('errorvalue');

      element('#pollingLocation-errors7 a').click();
      sleep(testGlobals.sleepTime);

      expect(element("#feeds-overview-streetsegments-errors-content").count()).toBe(1);

      errorcount2 = element('#total_errors').attr('errorvalue');
    });
    it('Should have matching error numbers - Street Segments', function () {
      expect(errorcount).toBe(errorcount2.value);

      // go back to the overview page
      element('#pageHeader-breadcrumb1 a').click();
      sleep(testGlobals.sleepTime);
    });


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