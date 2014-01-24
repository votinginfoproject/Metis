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
      expect(element('#feed-precinctsplit-streetsegments-errors-content').count()).toBe(1);

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