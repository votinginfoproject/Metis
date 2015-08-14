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

      expect(element('#locality-id0').count()).toBe(1);

      // click the contests link
      element('#locality-id0 a').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed contests page
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

      expect(element('#localityOverviewTable').count()).toBe(1);
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

    it('Error page link works', function() {
      element('#locality-errors').click();
      expect(element('#feeds-election-state-localities-errors-content').count()).toBe(1);
      element('#pageHeader-breadcrumb4 a').click();
      expect(element('#feed-locality-content').count()).toBe(1);
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
      expect(element('#feeds-election-state-electionadministration-content').count()).toBe(1);
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

    it('Error page link works', function() {
      element('#electionadmin-errors').click();
      expect(element('#feeds-election-state-localities-electionadministration-errors-content').count()).toBe(1);
      element('#pageHeader-breadcrumb5 a').click();
      expect(element('#feeds-election-state-electionadministration-content').count()).toBe(1);
    });

    // go back to the locality page
    it('Should be able to go back to the Locality page via the breadcrumbs', function () {

      // now go back to the locality page
      // click the state breadcrumb
      element('#pageHeader-breadcrumb4 a').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed locality page
      expect(element('#feed-locality-content').count()).toBe(1);
    });

  });

  /* ----------------------------------------
   Feed Locality Early Vote Site page
   ------------------------------------------*/
  describe('Check Feed Locality Early Vote Site page', function () {
    // if there is data
    it('Should be able to go into a Locality Early Vote Site page', function () {

      expect(element('#earlyVoteSite-id0 a').count()).toBe(1);
      element('#earlyVoteSite-id0 a').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed locality early vote site page
      expect(element('#feed-locality-content').count()).toBe(1);
    });

    // if there is data
    it('Should have Early Vote Site data', function () {

      expect(element('#name').html()).not().toBe("");
    });

  });

  describe('Check error page link', function() {
    it('Error page link works', function() {
      element('#earlyvotesite-errors').click();
      expect(element('#feeds-election-state-localities-earlyvotesites-errors-content').count()).toBe(1);
      element('#pageHeader-breadcrumb6 a').click();
      expect(element('#feed-locality-content').count()).toBe(1);
    });
  });

  /* ----------------------------------------
   Feed Locality Early Vote Sites page
   ------------------------------------------*/
  describe('Check Feed Locality Early Vote Sites page', function () {
    // if there is data
    it('Should be able to go into a Locality Early Vote Sites page via breadcrumbs', function () {

      element('#pageHeader-breadcrumb5 a').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed locality early vote sites page
      expect(element('#feeds-election-state-localities-earlyvotesites-content').count()).toBe(1);
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
      expect(element('#feeds-election-state-localities-earlyvotesites-content-single').count()).toBe(1);
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
