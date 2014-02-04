describe('Feed Precinct Test', function () {

  describe('Log in', function () {

    // Successful attempt
    //    currently only with local client, need to modify later for crowd
    it('Accepts a proper username + password', function () {
      e2eLogIn('testuser', 'test');
    });
  });

  /* ----------------------------------------
   Feed State page
   ------------------------------------------*/
  describe('Check Feed Precinct page', function () {

    it('Should go to the Feed Precinct page after selecting a feed and then Election and then State and then a Locality and then a Precinct', function () {

      // expect to start out on the feed index page
      // click the first feed
      element('#date0 a').click();
      sleep(testGlobals.sleepTime);

      // should have an election link
      expect(element('#election-link').count()).toBe(1);

      // click the election link
      element('#election-link').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed election page
      expect(element('#feed-election-content').count()).toBe(1);

      // should have a state link
      expect(element('#state-id a').count()).toBe(1);

      // click the state link
      element('#state-id a').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed state page
      expect(element('#feed-state-content').count()).toBe(1);

      // should have a locality link
      expect(element('#locality-id0 a').count()).toBe(1);

      // click the locality link
      element('#locality-id0 a').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed locality page
      expect(element('#feed-locality-content').count()).toBe(1);

      // should have a precinct link
      expect(element('#precinct-id0 a').count()).toBe(1);

      // click the precinct link
      element('#precinct-id0 a').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed precinct page
      expect(element('#feed-precinct-content').count()).toBe(1);
    });

  });

  /* ----------------------------------------
   Feed Precinct data
   ------------------------------------------*/
  describe('Check Feed Precinct data', function () {

    it('Should have Precinct data', function () {

      expect(element('#precinct-name').html()).not().toBe("");
    });

    it('Should have Early Vote Sites data', function () {

      expect(element('#earlyVoteSite0').count()).toBe(1);
    });

    it('Should have Electoral Districts data', function () {

      expect(element('#electoralDistrict0').count()).toBe(1);
    });

    it('Should have Polling Locations data', function () {

      expect(element('#pollingLocation0').count()).toBe(1);
    });

    it('Should have Precinct Splits data', function () {

      expect(element('#precinctSplit0').count()).toBe(1);
    });

  });

  describe('Check the error link', function() {
    it('Error link works', function() {
      element('#precinct-errors').click();
      expect(element('#feeds-election-state-localities-precincts-errors-content').count()).toBe(1);
      element('#pageHeader-breadcrumb7').click();
      expect(element('#feed-precinct-content').count()).toBe(1);
    });
  });

  /* ----------------------------------------
   Now from the Feed Precinct page, click the first Electoral District link
   ------------------------------------------*/
  describe('Click the Precinct first Electoral District link', function () {

    it('Click and go to the Electoral District page', function () {

      // Should have Electoral District link
      expect(element('#electoralDistrict-id0 a').count()).toBe(1);

      // click the link
      element('#electoralDistrict-id0 a').click();

      sleep(testGlobals.sleepTime);

      // should be on the Precinct Electoral District page
      expect(element('#feeds-election-state-localities-precincts-electoraldistricts-content-single').count()).toBe(1);

    });
  });

  /* ----------------------------------------
   Should have Precinct Electoral District data
   ------------------------------------------*/
  describe('Should have Precinct Electoral District data', function () {

    it('Should have Precinct Electoral District data', function () {

      // expect data
      expect(element('#name').count()).toBe(1);

      // expect data for the first Contests row
      expect(element('#contests0').count()).toBe(1);

      // expect data for the first Precincts row
      expect(element('#precinct0').count()).toBe(1);

      // expect data for the first Precinct Splits row
      expect(element('#precinctSplit0').count()).toBe(1);

    });
  });

  describe('Check error page link', function() {
    it('Error page link works', function() {
      element('#electoraldistrict-errors').click();
      expect(element('#feeds-election-state-localities-precincts-electoraldistricts-errors-content').count()).toBe(1);
      element('#pageHeader-breadcrumb9').click();
      expect(element('#feeds-election-state-localities-precincts-electoraldistricts-content-single').count()).toBe(1);
    });
  });

  /* ----------------------------------------
   Now from the Feed Precinct Electoral District page, click to the Electoral Districts page via the breadcrumb
   ------------------------------------------*/
  describe('Click the Precinct Electoral Districts breadcrumb', function () {

    it('Click and go to the Electoral Districts page', function () {

      // Should have Electoral Districts breadcrumb
      expect(element('#pageHeader-breadcrumb8').count()).toBe(1);

      // click the link
      element('#pageHeader-breadcrumb8').click();

      sleep(testGlobals.sleepTime);

      // should be on the Precinct Electoral Districts page
      expect(element('#feeds-election-state-localities-precincts-electoraldistricts-content').count()).toBe(1);

    });
  });

  /* ----------------------------------------
   Should have Precinct Electoral Districts data
   ------------------------------------------*/
  describe('Should have Precinct Electoral Districts data', function () {

    it('Should have Precinct Electoral Districts data', function () {

      // expect data
      expect(element('#electoralDistrict0').count()).toBe(1);

    });
  });


  /* ----------------------------------------
   Now from the Feed Precinct Electoral Districts page, click to the Precinct page via the breadcrumb
   ------------------------------------------*/
  describe('Click the Precinct breadcrumb', function () {

    it('Click and go to the Precinct page', function () {

      // Should have Precinct breadcrumb
      expect(element('#pageHeader-breadcrumb7').count()).toBe(1);

      // click the link
      element('#pageHeader-breadcrumb7').click();

      sleep(testGlobals.sleepTime);

      // should be on the Precinct page
      expect(element('#feed-precinct-content').count()).toBe(1);

    });
  });


  /* ----------------------------------------
   Feed Precinct Early Vote Site page
   ------------------------------------------*/
  describe('Check Feed Precinct Early Vote Site page', function () {
    // if there is data
    it('Should be able to go into a Precinct Early Vote Site page', function () {

      expect(element('#earlyVoteSite-id0 a').count()).toBe(1);
      element('#earlyVoteSite-id0 a').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed Precinct early vote site page
      expect(element('#feeds-election-state-localities-precincts-earlyvotesites-content-single').count()).toBe(1);
    });

    // if there is data
    it('Should have Early Vote Site data', function () {

      expect(element('#name').html()).not().toBe("");
    });

  });


  /* ----------------------------------------
   Feed Precinct Early Vote Sites page
   ------------------------------------------*/
  describe('Check Feed Precinct Early Vote Sites page', function () {
    // if there is data
    it('Should be able to go into a Precinct Early Vote Sites page via breadcrumbs', function () {

      element('#pageHeader-breadcrumb8').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed state early vote sites page
      expect(element('#feeds-election-state-localities-precincts-earlyvotesites-content').count()).toBe(1);
    });

    // if there is data
    it('Should have Early Vote Sites data', function () {

      expect(element('#earlyVoteSite-id0 a').html()).not().toBe("");

    });

    // click to an earlyvote site
    it('Should be able to click on the link and be taken back to an Early Vote Site page', function () {

      element('#earlyVoteSite-id0 a').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed state early vote site page
      expect(element('#feeds-election-state-localities-precincts-earlyvotesites-content-single').count()).toBe(1);
    });


    // click to an earlyvote site
    it('Should be able to click on the breadcrumb and be taken back to the Precinct page', function () {

      element('#pageHeader-breadcrumb7').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed precinct page
      expect(element('#feed-precinct-content').count()).toBe(1);
    });

  });

  /* ----------------------------------------
   Now from the Feed Precinct page, click the Street Segments error link
   ------------------------------------------*/
  describe('Click the Precinct StreetSegment error link', function () {

    it('Click and go to the Street Segments error page', function () {

      // Should have Precinct Street Segments errors link
      expect(element('#streetsegments-errors').count()).toBe(1);

      // click the link
      element('#streetsegments-errors').click();

      sleep(testGlobals.sleepTime);

      // should be on the Precinct Street Segments Error page
      expect(element('#feeds-election-state-localities-precincts-streetsegments-errors-content').count()).toBe(1);

    });
  });

  /* ----------------------------------------
   Should have Precinct Street Segments Error data
   ------------------------------------------*/
  describe('Should have Precinct Street Segments Error data', function () {

    it('Should have Precinct Street Segments Error data', function () {

      // Should have Precinct Street Segments error data

      // expect data for the first error row
      expect(element('#error0').count()).toBe(1);

      // expect data for the first column in the first row
      expect(element('#error-count0').count()).toBe(1);

      // expect data for the detail for the first error row should be hidden
      expect(element("#errorDetail0:visible").count()).toBe(0);

      // click on the first row to show the error details
      element('#error-count0 a').click();

      sleep(testGlobals.sleepTime);

      // the detail for the first error row should now be showing
      expect(element("#errorDetail0:visible").count()).toBe(1);

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