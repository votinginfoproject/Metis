describe('Breadcrumbs Test', function () {

  /* ----------------------------------------
      This should become a utility
  ------------------------------------------*/
  describe('Log in', function () {
    // Successful attempt
    //    currently only with local client, need to modify later for crowd
    it('Accepts a proper username + password', function () {
      browser().navigateTo(testGlobals.appRootUrl);
      sleep(1);
      e2eLogIn('testuser','test');
      sleep(1);
      expect(element('#username').count()).toBe(0);
    });
  });

  /* ----------------------------------------
   Feed Index page breadcrumb
   ------------------------------------------*/
  describe('Check Feed page breadcrumbs', function () {
    // check the feed page breadcrumb, which we should be on right after logging in
    it('Should have one breadcrumb', function () {

      expect(element('#pageHeader-breadcrumb0').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb1').count()).toBe(0);
    });

    // check the feed page breadcrumb, which we should be on as we just logged in
    it('First breadcrumb should have a value of FEEDS', function () {

      expect(element('#pageHeader-breadcrumb0').html()).toBe("FEEDS");

      /*
      element('#pageHeader-breadcrumb0').query(function (elem, done) {
        done();
      });
      */

    });
  });

;  /* ----------------------------------------
      Log Out
   ------------------------------------------*/
  describe('Logging out', function () {
    // Signs out of the application
    it('Sign out of the app', function () {
      e2eLogOut();
      sleep(1);
      expect(element('#username').count()).toBe(1);
    });
  });
});