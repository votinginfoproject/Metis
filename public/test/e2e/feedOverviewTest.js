describe('Feed Overview Test', function () {

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
   Feed Overview Polling Locations
   ------------------------------------------*/
  describe('Check Feed Overview polling locations', function () {
    // check the the number of items
    it('Should have polling locations', function () {

      expect(element('#pollingLocation0').count()).toBe(1);
    });

  });

  /* ----------------------------------------
   Feed Overview Contests
   ------------------------------------------*/
  describe('Check Feed Contests', function () {
    // check the the number of items
    it('Should have contests', function () {

      expect(element('#feedContests0').count()).toBe(1);
    });

  });

  /* ----------------------------------------
   Feed Overview Results
   ------------------------------------------*/
  describe('Check Feed Results', function () {
    // check the the number of items
    it('Should have results', function () {

      expect(element('#feedResults0').count()).toBe(1);
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