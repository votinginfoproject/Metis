describe('Feed Locality Test', function () {

  describe('Log in', function () {

    // Successful attempt
    //    currently only with local client, need to modify later for crowd
    it('Accepts a proper username + password', function () {
      e2eLogIn('testuser', 'test');
    });
  });

  /* ----------------------------------------
   Feed Locality page
   ------------------------------------------*/
  describe('Check Feed Locality page', function () {

    it('Should go to the Feed Locality page after selecting a feed and then Election and then State and then a Locality', function () {

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

    });

  });

  /* ----------------------------------------
   Feed Locality data
   ------------------------------------------*/
  describe('Check Feed Locality data', function () {

    it('Should have Locality data', function () {

      expect(element('#locality-name').html()).not().toBe("");
    });

    it('Should have Overview data', function () {

      expect(element('#locality0').count()).toBe(1);
    });

    it('Should have Early Vote Sites data', function () {

      expect(element('#earlyVoteSite0').count()).toBe(1);
    });

    it('Should have Election Administration data', function () {

      expect(element('#locality-administration-id').count()).toBe(1);
    });

    it('Should have Precincts data', function () {

      expect(element('#precinct0').count()).toBe(1);
    });
  });

  /* ----------------------------------------
   Feed Locality Election Administration page
   ------------------------------------------*/
  describe('Check Feed Locality Election Administration page', function () {
    // check the the number of items
    it('Should go to the Locality Election Administration page', function () {

      expect(element('#locality-administration-id').count()).toBe(1);
      // click the state link
      element('#locality-administration-id a').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed locality election administration page
      expect(element('#feed-locality-electionadministration-content').count()).toBe(1);
    });

    // if there is data
    it('Should have an Election Admin data', function () {

      expect(element('#name').html()).not().toBe("");
    });

    // if there is data
    it('Should have an Election Admin - Election Official data', function () {

      expect(element('#eo-name').html()).not().toBe("");
    });

    // if there is data
    it('Should have an Election Admin - Overseas Voter Contact data', function () {

      expect(element('#ovc-name').html()).not().toBe("");
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