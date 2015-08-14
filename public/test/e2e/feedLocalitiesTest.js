describe('Feed Localities Test', function () {

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
  describe('Check Feed Localities page', function () {

    it('Should go to the Feed Localities page after selecting a feed and then Election and then State and then a Locality and then the 2nd to last breadcrumb', function () {

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
      
      expect(element('#pageHeader-breadcrumb3').count()).toBe(1);
      element('#pageHeader-breadcrumb3 a').click();
      sleep(testGlobals.sleepTime);

      expect(element('#feed-localities-content').count()).toBe(1);
    });

  });

  /* ----------------------------------------
   Feed Localities data
   ------------------------------------------*/
  describe('Check Feed Localities data', function () {

    it('Should have localities data', function () {

      expect(element('#locality0').count()).toBe(1);
      expect(element('#locality-name0').count()).toBe(1);
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
