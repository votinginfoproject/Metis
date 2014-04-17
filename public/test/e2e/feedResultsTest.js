describe('Feed Results Test', function () {

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
   Feed Results page
   ------------------------------------------*/
  describe('Check Feed Results page', function () {
    // check the the number of feeds
    it('Should go to the Feed Results page after selecting the Results link on the sidebar', function () {

      // click the first feed
      element('#sidebar-results').click();

      sleep(testGlobals.sleepTime);

      // should be on the feed overview page
      expect(element('#feed-results-content').count()).toBe(1);
    });

  });

  /* ----------------------------------------
   Feed Results - Contest Results
   ------------------------------------------*/
  describe('Check Feed Results - Contest Results', function () {
    // check the the number of items
    it('Should have contest results', function () {

      expect(element('#contestresults0').count()).toBe(1);
      expect(element('#contestresults-id0').count()).toBe(1);

      // click into a contest result
      expect(element('#contestresults-id0 a').count()).toBe(1);
      element('#contestresults-id0 a').click();

      sleep(testGlobals.sleepTime);

      // should be on a Contest Result page
      expect(element('#feed-contestresult-content').count()).toBe(1);

    });

  });

  /* ----------------------------------------
   Go back to Feed Results page
   ------------------------------------------*/
  describe('Back to Feed Results page', function () {
    // check the the number of feeds
    it('Should go to the Feed Results page after selecting the Results link on the sidebar', function () {

      // click the first feed
      element('#sidebar-results').click();

      sleep(testGlobals.sleepTime);

      // should be on the feed overview page
      expect(element('#feed-results-content').count()).toBe(1);
    });

  });

  /* ----------------------------------------
   Feed Results - Ballot Line Results
   ------------------------------------------*/
  describe('Check Feed Results - Ballot Line Results', function () {
    // check the the number of items
    it('Should have ballot line results', function () {

      expect(element('#ballotlineresults0').count()).toBe(1);
      expect(element('#ballotlineresults-id0').count()).toBe(1);

      // click into a ballot line result
      expect(element('#ballotlineresults-id0 a').count()).toBe(1);
      element('#ballotlineresults-id0 a').click();

      sleep(testGlobals.sleepTime);

      // should be on a Ballot Line Result page
      expect(element('#feed-ballotlineresult-content').count()).toBe(1);

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