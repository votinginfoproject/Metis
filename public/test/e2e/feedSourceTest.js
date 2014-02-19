describe('Feed Source Test', function () {

  describe('Log in', function () {

    // Successful attempt
    //    currently only with local client, need to modify later for crowd
    it('Accepts a proper username + password', function () {
      e2eLogIn('testuser', 'test');
    });
  });

  /* ----------------------------------------
   Feed Source page
   ------------------------------------------*/
  describe('Check Feed Source page', function () {

    it('Should go to the Feed Source page after selecting a feed and then source', function () {

      // expect to start out on the feed index page

      // click the first feed
      element('#date0 a').click();
      sleep(testGlobals.sleepTime);

      expect(element('#source-link').count()).toBe(1);

      // click the source link
      element('#source-link').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed Source page
      expect(element('#feed-source-content').count()).toBe(1);
    });

  });

  /* ----------------------------------------
   Feed Source data
   ------------------------------------------*/
  describe('Check Feed Source data', function () {
    // check the the number of items
    xit('Should have source data', function () {

      expect(element('#source-name').count()).toBe(1);
    });

  });

  /* ----------------------------------------
   Feed Source page Feed Contact
   ------------------------------------------*/
  describe('Check Feed Contact data', function () {
    // check the the number of items
    xit('Should have feed contact data', function () {

      expect(element('#feed-contact-name').count()).toBe(1);
    });

  });

  describe('Check The Error Links', function() {
    it('Error page link works', function() {
      element('#source-errors').click();
      expect(element('#feeds-source-errors-content').count()).toBe(1);
    })
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