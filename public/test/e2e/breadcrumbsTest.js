describe('Breadcrumbs Test', function () {


  /* ----------------------------------------
   This should become a utility
   ------------------------------------------*/
  describe('Log in', function () {

    // Successful attempt
    //    currently only with local client, need to modify later for crowd
    it('Accepts a proper username + password', function () {
      e2eLogIn('testuser', 'test');
      sleep(1);
      expect(element('#username').count()).toBe(0);
    });
  });

  /* ----------------------------------------
   Feed Index page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Index page breadcrumb', function () {
    // check the the number of feeds
    it('Should have 1 breadcrumb', function () {

      expect(element('#pageHeader-breadcrumb0').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb1').count()).toBe(0);
    });

    // check the feed breadcrumb values
    it('Breadcrumb values should be correct', function () {

      expect(element('#pageHeader-breadcrumb0').html()).toBe("FEEDS");

      /*
       element('#pageHeader-breadcrumb0').query(function (elem, done) {
       done();
       });
       */

    });
  });

  /* ----------------------------------------
   Feed Overview page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Overview page breadcrumb', function () {
    // check the the number of feeds
    it('Should have 2 breadcrumbs', function () {

      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1");
      sleep(1);

      expect(element('#pageHeader-breadcrumb0').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb1').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb2').count()).toBe(0);
    });

    // check the feed breadcrumb values
    it('Breadcrumb values should be correct', function () {

      expect(element('#pageHeader-breadcrumb0').html()).toBe("FEEDS");
      expect(element('#pageHeader-breadcrumb1').html()).toBe("vip-feed1");

    });
  });

  /* ----------------------------------------
   Feed Source page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Source page breadcrumb', function () {
    // check the the number of feeds
    it('Should have 3 breadcrumbs', function () {

      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/source");
      sleep(1);

      expect(element('#pageHeader-breadcrumb0').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb1').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb2').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb3').count()).toBe(0);
    });

    // check the feed breadcrumb values
    it('Breadcrumb values should be correct', function () {

      expect(element('#pageHeader-breadcrumb0').html()).toBe("FEEDS");
      expect(element('#pageHeader-breadcrumb1').html()).toBe("vip-feed1");
      expect(element('#pageHeader-breadcrumb2').html()).toBe("SOURCE");

    });
  });

  /* ----------------------------------------
   Log Out
   ------------------------------------------*/
  describe('Logging out', function () {
    // Signs out of the application
    it('Sign out of the app', function () {
      e2eLogOut();
      expect(element('#username').count()).toBe(1);
    });
  });
});