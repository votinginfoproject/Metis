describe('Feed Source Test', function () {


  /* ----------------------------------------
   Login
   ------------------------------------------*/
  describe('Log in', function () {

    // Successful attempt
    //    currently only with local client, need to modify later for crowd
    it('Accepts a proper username + password', function () {
      e2eLogIn('testuser', 'test');
    });
  });

  /* ----------------------------------------
   Go to the Source page for a given vipfeed
   ------------------------------------------*/
  describe('Smoke test for Feed Source page', function () {
    // check the the number of feeds
    it('Should bring up the Feed Source page', function () {

      e2eLoadPage(testGlobals.appFeedsUrl + "/vip-feed1/source");

      expect(element('#feed-source-content').count()).toBe(1);
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