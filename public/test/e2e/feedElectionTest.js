describe('Feed Election Test', function () {

  describe('Log in', function () {

    // Successful attempt
    //    currently only with local client, need to modify later for crowd
    it('Accepts a proper username + password', function () {
      e2eLogIn('testuser', 'test');
    });
  });

  /* ----------------------------------------
   Feed Election page
   ------------------------------------------*/
  describe('Check Feed Election page', function () {

    it('Should go to the Feed Election page after selecting a feed and then election', function () {

      // expect to start out on the feed index page
      // click the first feed
      element('#date0 a').click();
      sleep(testGlobals.sleepTime);

      expect(element('#election-link').count()).toBe(1);

      // click the election link
      element('#election-link').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed Source page
      expect(element('#feed-election-content').count()).toBe(1);
    });

  });

  /* ----------------------------------------
   Feed Election data
   ------------------------------------------*/
  describe('Check Feed Election data', function () {
    // check the the number of items
    it('Should have election data', function () {

      expect(element('#election-type').count()).toBe(1);
    });

  });

  /* ----------------------------------------
   Feed Election state data
   ------------------------------------------*/
  describe('Check Feed Election state data', function () {
    // check the the number of items
    it('Should have election state data', function () {

      expect(element('#state-name').count()).toBe(1);
    });

  });

  /* ----------------------------------------
   Feed Election Contests
   ------------------------------------------*/
  describe('Check Feed Election Contests', function () {
    // check the the number of items
    it('Should have contests', function () {
      expect(element('#contests-id0').count()).toBe(1);
    });

  });

  describe('Check Feed Error Link', function() {
    it('Error link works', function() {
      element('#election-errors').click();
      expect(element('#feeds-election-errors-content').count()).toBe(1);
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