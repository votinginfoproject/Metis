describe('Feed Precincts Test', function () {

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
  describe('Check Feed Precincts page', function () {

    it('Should go to the Feed Precincts page after selecting a feed and then Election and then State and then a Locality and then a Precinct and then the 2nd to last breadcrumb', function () {

      // expect to start out on the feed index page
      // click the first feed
      element('#date0 a').click();
      sleep(testGlobals.sleepTime);

      /*
       expect(element('#election-link').count()).toBe(1);

       // click the election link
       element('#election-link').click();
       sleep(testGlobals.sleepTime);
       */

      expect(element('#sidebar-election').count()).toBe(1);

      // click the election link
      element('#sidebar-election').click();
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

      // click the precincts link
      expect(element('#pageHeader-breadcrumb6 a').html()).toBe("Precincts");
      element('#pageHeader-breadcrumb6 a').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed precincts page
      expect(element('#feed-precincts-content').count()).toBe(1);

    });

  });

  /* ----------------------------------------
   Feed Precincts data
   ------------------------------------------*/
  describe('Check Feed Precincts data', function () {

    it('Should have Precincts data', function () {

      expect(element('#precinct0').count()).toBe(1);
      expect(element('#precinct-id0').count()).toBe(1);
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