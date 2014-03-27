describe('Feed Precinct Splits Test', function () {

  describe('Log in', function () {

    // Successful attempt
    //    currently only with local client, need to modify later for crowd
    it('Accepts a proper username + password', function () {
      e2eLogIn('testuser', 'test');
    });
  });

  /* ----------------------------------------
   Feed Precinct Splits page
   ------------------------------------------*/
  describe('Check Feed Precinct Splits page', function () {

    it('Should go to the Feed Precinct Splits page after selecting a feed and then Election and then State and then a Locality and then a Precinct and then a Precint Split and then the 2nd to last breadcrumb', function () {

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

      // click the precinct splits link
      expect(element('#pageHeader-breadcrumb8 a').html()).toBe("Precinct Splits");
      element('#pageHeader-breadcrumb8 a').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed precinct splits page
      expect(element('#feed-precinctsplits-content').count()).toBe(1);

    });

  });

  /* ----------------------------------------
   Feed Precinct Splits data
   ------------------------------------------*/
  describe('Check Feed Precinct Splits data', function () {

    it('Should have Precinct Splits data', function () {

      expect(element('#precinctsplit0').count()).toBe(1);
      expect(element('#precinctsplit-id0').count()).toBe(1);
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