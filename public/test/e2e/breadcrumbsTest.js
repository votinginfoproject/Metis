describe('Breadcrumbs Test', function () {

  /* ----------------------------------------
      This should become a utility
  ------------------------------------------*/
  describe('Log in', function () {
    // Successful attempt
    //    currently only with local client, need to modify later for crowd
    it('Accepts a proper username + password', function () {
      browser().navigateTo('http://localhost:4000');
      sleep(1);
      input('username').enter('testuser');
      input('password').enter('test');
      element('#sign-in').click();
      sleep(1);
      expect(element('#username').count()).toBe(0);
    });
  });

  /* ----------------------------------------
   Feed page breadcrumb
   ------------------------------------------*/
  /*
  describe('Check Feed page breadcrumbs', function () {
    // check the feed page breadcrumb, which we should be on right after logging in
    it('Should have one breadcrumb', function () {

      expect(element('#pageHeader-breadcrumb0').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb1').count()).toBe(0);
    });

    // check the feed page breadcrumb, which we should be on right after logging in
    it('First breadcrumb should have a value of FEEDS', function () {

      //console.dir(element('#pageHeader-breadcrumb0'));
      //console.log(element('#pageHeader-breadcrumb0').text());
    });
  })
  */

;  /* ----------------------------------------
      Log Out
   ------------------------------------------*/
  describe('Logging out', function () {
    // Signs out of the application
    it('Sign out of the app', function () {
      element('#pageHeader-sign-out').click();
      sleep(1);
      expect(element('#username').count()).toBe(1);
    });
  });
});