describe('Feed State Test', function () {

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
  describe('Check Feed State page', function () {

    it('Should go to the Feed State page after selecting a feed and then Election and then State', function () {

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

    });

  });

  /* ----------------------------------------
   Feed State data
   ------------------------------------------*/
  describe('Check Feed State data', function () {
    // if there is data
    it('Should have Early Vote Sites data', function () {

      expect(element('#earlyVoteSite0').count()).toBe(1);
    });

    // if there is data
    it('Should have Election Administration data', function () {

      expect(element('#state-administration-id').count()).toBe(1);
    });

    // if there is data
    it('Should have State locality data', function () {

      expect(element('#locality0').count()).toBe(1);
      expect(element('#locality-name0').count()).toBe(1);
    });

  });

  /* ----------------------------------------
   Feed State Election Administration page
   ------------------------------------------*/
  describe('Check Feed State Election Administration page', function () {
    // check the the number of items
    it('Should go to the State Election Administration page', function () {

      expect(element('#state-administration-id').count()).toBe(1);
      // click the state link
      element('#state-administration-id a').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed state election administration page
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

    // go back to state page
    it('Should be able to go back to the State page via the breadcrumbs', function () {

      // now go back to the state page
      // click the state breadcrumb
      element('#pageHeader-breadcrumb3').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed state page
      expect(element('#feed-state-content').count()).toBe(1);
    });

  });

  /* ----------------------------------------
   Feed State Early Vote Site page
   ------------------------------------------*/
  describe('Check Feed State Early Vote Site page', function () {
    // if there is data
    it('Should be able to go into a State Early Vote Site page', function () {

      expect(element('#earlyVoteSite-id0 a').count()).toBe(1);
      element('#earlyVoteSite-id0 a').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed state early vote site page
      expect(element('#feeds-election-state-earlyvotesites-content-single').count()).toBe(1);
    });

    // if there is data
    it('Should have Early Vote Site data', function () {

      expect(element('#name').html()).not().toBe("");
    });

  });

  /* ----------------------------------------
   Feed State Early Vote Sites page
   ------------------------------------------*/
  describe('Check Feed State Early Vote Sites page', function () {
    // if there is data
    it('Should be able to go into a State Early Vote Sites page via breadcrumbs', function () {

      element('#pageHeader-breadcrumb4').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed state early vote sites page
      expect(element('#feeds-election-state-earlyvotesites-content').count()).toBe(1);
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
      expect(element('#feeds-election-state-earlyvotesites-content-single').count()).toBe(1);
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