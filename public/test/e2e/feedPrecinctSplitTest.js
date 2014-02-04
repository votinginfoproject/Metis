describe('Feed Precinct Split Test', function () {

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
  describe('Check Feed Precinct Split page', function () {

    it('Should go to the Feed Precinct page after selecting a feed and then Election and then State and then a Locality and then a Precinct and then a Precinct Split', function () {

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

      // should have a precinct split link
      expect(element('#precinctSplit-id0 a').count()).toBe(1);

      // click the precinct split link
      element('#precinctSplit-id0 a').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed precinct split page
      expect(element('#feed-precinctsplit-content').count()).toBe(1);

    });

  });

  /* ----------------------------------------
   Feed Precinct Split data
   ------------------------------------------*/
  describe('Check Feed Precinct Split data', function () {

    it('Should have Precinct Split data', function () {

      expect(element('#precinctsplit-name').html()).not().toBe("");
    });

    it('Should have Electoral Districts data', function () {

      expect(element('#electoralDistrict0').count()).toBe(1);
    });

    it('Should have Polling Locations data', function () {

      expect(element('#pollingLocation0').count()).toBe(1);
    });

  });

  describe('Checks the error page link', function() {
    it('error page works', function() {
      element('#precinctsplit-errors').click();
      expect(element('#feeds-election-state-localities-precincts-precinctsplits-errors-content').count()).toBe(1);
      element('#pageHeader-breadcrumb9').click();
      expect(element('#feed-precinctsplit-content').count()).toBe(1);
    });
  });

  /* ----------------------------------------
   Now from the Feed PrecinctSplit page, click the first Electoral District link
   ------------------------------------------*/
  describe('Click the PrecinctSplit first Electoral District link', function () {

    it('Click and go to the Electoral District page', function () {

      // Should have Electoral District link
      expect(element('#electoralDistrict-id0 a').count()).toBe(1);

      // click the link
      element('#electoralDistrict-id0 a').click();

      sleep(testGlobals.sleepTime);

      // should be on the Precinct Electoral District page
      expect(element('#feeds-election-state-localities-precincts-precinctsplits-electoraldistricts-content-single').count()).toBe(1);

    });
  });

  /* ----------------------------------------
   Should have PrecinctSplit Electoral District data
   ------------------------------------------*/
  describe('Should have PrecinctSplit Electoral District data', function () {

    it('Should have PrecinctSplit Electoral District data', function () {

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

  /* ----------------------------------------
   Now from the Feed PrecinctSplit Electoral District page, click to the Electoral Districts page via the breadcrumb
   ------------------------------------------*/
  describe('Click the PrecinctSpit Electoral Districts breadcrumb', function () {

    it('Click and go to the Electoral Districts page', function () {

      // Should have Electoral Districts breadcrumb
      expect(element('#pageHeader-breadcrumb10').count()).toBe(1);

      // click the link
      element('#pageHeader-breadcrumb10').click();

      sleep(testGlobals.sleepTime);

      // should be on the Precinct Electoral Districts page
      expect(element('#feeds-election-state-localities-precincts-precinctsplits-electoraldistricts-content').count()).toBe(1);

    });
  });

  /* ----------------------------------------
   Should have PrecinctSplit Electoral Districts data
   ------------------------------------------*/
  describe('Should have PrecinctSplit Electoral Districts data', function () {

    it('Should have PrecinctSplit Electoral Districts data', function () {

      // expect data
      expect(element('#electoralDistrict0').count()).toBe(1);

    });
  });

  /* ----------------------------------------
   Now from the Feed PrecinctSplit Electoral Districts page, click to the PrecinctSplit page via the breadcrumb
   ------------------------------------------*/
  describe('Click the Precinct breadcrumb', function () {

    it('Click and go to the Precinct page', function () {

      // Should have Precinct breadcrumb
      expect(element('#pageHeader-breadcrumb9').count()).toBe(1);

      // click the link
      element('#pageHeader-breadcrumb9').click();

      sleep(testGlobals.sleepTime);

      // should be on the Precinct page
      expect(element('#feed-precinctsplit-content').count()).toBe(1);

    });
  });

  /* ----------------------------------------
   Now from the Feed Precinct Split page, click the Street Segments error link
   ------------------------------------------*/
  describe('Click the Precinct Split StreetSegment error link', function () {

    it('Click and go to the Street Segments error page', function () {

      // Should have Precinct Split Street Segments errors link
      expect(element('#streetsegments-errors').count()).toBe(1);

      // click the link
      element('#streetsegments-errors').click();

      sleep(testGlobals.sleepTime);

      // should be on the Precinct Split Street Segments Error page
      expect(element('#feeds-election-state-localities-precincts-precinctsplits-streetsegments-errors-content').count()).toBe(1);

    });
  });

  /* ----------------------------------------
   Should have Precinct Split Street Segments Error data
   ------------------------------------------*/
  describe('Should have Precinct Split Street Segments Error data', function () {

    it('Should have Precinct Split Street Segments Error data', function () {

      // Should have Precinct Split Street Segments error data

      // expect data for the  first error row
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