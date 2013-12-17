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
    // check the the number of feeds
    xit('Should have 3 polling locations', function () {

      expect(element('#pageHeader-breadcrumb0').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb1').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb2').count()).toBe(0);
    });

    // check the feed breadcrumb values
    xit('Breadcrumb values should be correct', function () {

      expect(element('#pageHeader-breadcrumb0').html()).toBe("Feeds");
      expect(element('#pageHeader-breadcrumb1').html()).toBe("vip-feed1");

    });
  });

  /* ----------------------------------------
   Feed Source page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Source page breadcrumb', function () {
    // check the the number of feeds
    xit('Should have 3 breadcrumbs', function () {

      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/source");
      sleep(1);

      expect(element('#pageHeader-breadcrumb0').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb1').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb2').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb3').count()).toBe(0);
    });

    // check the feed breadcrumb values
    xit('Breadcrumb values should be correct', function () {

      expect(element('#pageHeader-breadcrumb0').html()).toBe("Feeds");
      expect(element('#pageHeader-breadcrumb1').html()).toBe("vip-feed1");
      expect(element('#pageHeader-breadcrumb2').html()).toBe("Source");

    });
  });

  /* ----------------------------------------
   Feed Election page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Election page breadcrumb', function () {
    // check the the number of feeds
    xit('Should have 3 breadcrumbs', function () {

      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election");
      sleep(1);

      expect(element('#pageHeader-breadcrumb0').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb1').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb2').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb3').count()).toBe(0);
    });

    // check the feed breadcrumb values
    xit('Breadcrumb values should be correct', function () {

      expect(element('#pageHeader-breadcrumb0').html()).toBe("Feeds");
      expect(element('#pageHeader-breadcrumb1').html()).toBe("vip-feed1");
      expect(element('#pageHeader-breadcrumb2').html()).toBe("Election");

    });
  });

  /* ----------------------------------------
   Now from the Feed Election page, click the 2nd breadcrumb
   ------------------------------------------*/
  describe('Click the vip-feed breadcrumb to be taken to the feed overview page', function () {
    // check the the number of feeds
    xit('Clicking breadcrumb should go to Feed Overview page', function () {

      // click 2nd breadcrumb
      element('#pageHeader-breadcrumb1').click();

      sleep(testGlobals.sleepTime);

      // should be on the feed overview page
      expect(element('#feed-overview-content').count()).toBe(1);

    });
  });

  /* ----------------------------------------
   Now from the Feed Overview page, click the 1st breadcrumb
   ------------------------------------------*/
  describe('Click the feeds breadcrumb to be taken to the feed index page', function () {
    // check the the number of feeds
    xit('Clicking breadcrumb should go to Feed Index page', function () {

      // click 1st breadcrumb
      element('#pageHeader-breadcrumb0').click();

      sleep(testGlobals.sleepTime);

      // should be on the feed index page
      expect(element('#feedsTable').count()).toBe(1);

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