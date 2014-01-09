describe('Breadcrumbs Test', function () {


  describe('Log in', function () {

    // Successful attempt
    //    currently only with local client, need to modify later for crowd
    it('Accepts a proper username + password', function () {
      e2eLogIn('testuser', 'test');
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

      expect(element('#pageHeader-breadcrumb0').html()).toBe("Feeds");

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

      expect(element('#pageHeader-breadcrumb0').html()).toBe("Feeds");
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
    it('Should have 3 breadcrumbs', function () {

      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election");
      sleep(1);

      expect(element('#pageHeader-breadcrumb0').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb1').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb2').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb3').count()).toBe(0);
    });

    // check the feed breadcrumb values
    it('Breadcrumb values should be correct', function () {

      expect(element('#pageHeader-breadcrumb0').html()).toBe("Feeds");
      expect(element('#pageHeader-breadcrumb1').html()).toBe("vip-feed1");
      expect(element('#pageHeader-breadcrumb2').html()).toBe("Election");

    });
  });

  /* ----------------------------------------
   Feed State page breadcrumb
   ------------------------------------------*/
  describe('Check Feed State page breadcrumb', function () {
    // check the the number of feeds
    it('Should have 4 breadcrumbs', function () {

      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election/state");
      sleep(1);

      expect(element('#pageHeader-breadcrumb0').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb1').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb2').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb3').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb4').count()).toBe(0);
    });

    // check the feed breadcrumb values
    it('Breadcrumb values should be correct', function () {

      expect(element('#pageHeader-breadcrumb0').html()).toBe("Feeds");
      expect(element('#pageHeader-breadcrumb1').html()).toBe("vip-feed1");
      expect(element('#pageHeader-breadcrumb2').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb3').html()).toBe("State");

    });
  });

  /* ----------------------------------------
   Feed Localities page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Localities page breadcrumb', function () {
    // check the the number of feeds
    it('Should have 5 breadcrumbs', function () {

      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election/state/localities");
      sleep(1);

      expect(element('#pageHeader-breadcrumb0').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb1').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb2').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb3').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb4').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb5').count()).toBe(0);
    });

    // check the feed breadcrumb values
    it('Breadcrumb values should be correct', function () {

      expect(element('#pageHeader-breadcrumb0').html()).toBe("Feeds");
      expect(element('#pageHeader-breadcrumb1').html()).toBe("vip-feed1");
      expect(element('#pageHeader-breadcrumb2').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb3').html()).toBe("State");
      expect(element('#pageHeader-breadcrumb4').html()).toBe("Localities");

    });
  });

  /* ----------------------------------------
   Feed Locality page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Locality page breadcrumb', function () {
    // check the the number of feeds
    it('Should have 6 breadcrumbs', function () {

      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election/state/localities/local1");
      sleep(1);

      expect(element('#pageHeader-breadcrumb0').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb1').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb2').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb3').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb4').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb5').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb6').count()).toBe(0);
    });

    // check the feed breadcrumb values
    it('Breadcrumb values should be correct', function () {

      expect(element('#pageHeader-breadcrumb0').html()).toBe("Feeds");
      expect(element('#pageHeader-breadcrumb1').html()).toBe("vip-feed1");
      expect(element('#pageHeader-breadcrumb2').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb3').html()).toBe("State");
      expect(element('#pageHeader-breadcrumb4').html()).toBe("Localities");
      expect(element('#pageHeader-breadcrumb5').html()).toBe("local1");

    });
  });

  /* ----------------------------------------
   Feed Precincts page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Precincts page breadcrumb', function () {
    // check the the number of feeds
    it('Should have 7 breadcrumbs', function () {

      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election/state/localities/local1/precincts");
      sleep(1);

      expect(element('#pageHeader-breadcrumb0').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb1').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb2').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb3').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb4').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb5').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb6').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb7').count()).toBe(0);
    });

    // check the feed breadcrumb values
    it('Breadcrumb values should be correct', function () {

      expect(element('#pageHeader-breadcrumb0').html()).toBe("Feeds");
      expect(element('#pageHeader-breadcrumb1').html()).toBe("vip-feed1");
      expect(element('#pageHeader-breadcrumb2').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb3').html()).toBe("State");
      expect(element('#pageHeader-breadcrumb4').html()).toBe("Localities");
      expect(element('#pageHeader-breadcrumb5').html()).toBe("local1");
      expect(element('#pageHeader-breadcrumb6').html()).toBe("Precincts");

    });
  });

  /* ----------------------------------------
   Feed Precinct page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Precinct page breadcrumb', function () {
    // check the the number of feeds
    it('Should have 8 breadcrumbs', function () {

      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election/state/localities/local1/precincts/precinct1");
      sleep(1);

      expect(element('#pageHeader-breadcrumb0').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb1').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb2').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb3').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb4').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb5').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb6').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb7').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb8').count()).toBe(0);
    });

    // check the feed breadcrumb values
    it('Breadcrumb values should be correct', function () {

      expect(element('#pageHeader-breadcrumb0').html()).toBe("Feeds");
      expect(element('#pageHeader-breadcrumb1').html()).toBe("vip-feed1");
      expect(element('#pageHeader-breadcrumb2').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb3').html()).toBe("State");
      expect(element('#pageHeader-breadcrumb4').html()).toBe("Localities");
      expect(element('#pageHeader-breadcrumb5').html()).toBe("local1");
      expect(element('#pageHeader-breadcrumb6').html()).toBe("Precincts");
      expect(element('#pageHeader-breadcrumb7').html()).toBe("precinct1");

    });
  });

  /* ----------------------------------------
   Now from the Feed Precinct page, click the 7th breadcrumb
   ------------------------------------------*/
  describe('Click the Precincts breadcrumb to be taken to the feed Precincts page', function () {

    it('Clicking breadcrumb should go to Feed Precincts page', function () {

      // click 7th breadcrumb
      element('#pageHeader-breadcrumb6').click();

      sleep(testGlobals.sleepTime);

      // should be on the feed precincts page
      expect(element('#feed-precincts-content').count()).toBe(1);

    });
  });

  /* ----------------------------------------
   Now from the Feed Precincts page, click the 6th breadcrumb
   ------------------------------------------*/
  describe('Click the Locality breadcrumb to be taken to the feed Locality page', function () {

    it('Clicking breadcrumb should go to Feed Locality page', function () {

      // click 6th breadcrumb
      element('#pageHeader-breadcrumb5').click();

      sleep(testGlobals.sleepTime);

      // should be on the feed locality page
      expect(element('#feed-locality-content').count()).toBe(1);

    });
  });

  /* ----------------------------------------
   Now from the Feed Locality page, click the 5th breadcrumb
   ------------------------------------------*/
  describe('Click the Localities breadcrumb to be taken to the feed Localities page', function () {

    it('Clicking breadcrumb should go to Feed Localities page', function () {

      // click 5th breadcrumb
      element('#pageHeader-breadcrumb4').click();

      sleep(testGlobals.sleepTime);

      // should be on the feed state page
      expect(element('#feed-localities-content').count()).toBe(1);

    });
  });

  /* ----------------------------------------
   Now from the Feed Localities page, click the 4th breadcrumb
   ------------------------------------------*/
  describe('Click the State breadcrumb to be taken to the feed State page', function () {

    it('Clicking breadcrumb should go to Feed State page', function () {

      // click 4th breadcrumb
      element('#pageHeader-breadcrumb3').click();

      sleep(testGlobals.sleepTime);

      // should be on the feed state page
      expect(element('#feed-state-content').count()).toBe(1);

    });
  });

  /* ----------------------------------------
   Now from the Feed State page, click the 3rd breadcrumb
   ------------------------------------------*/
  describe('Click the Election breadcrumb to be taken to the feed Election page', function () {
    // check the the number of feeds
    it('Clicking breadcrumb should go to Feed Election page', function () {

      // click 3rd breadcrumb
      element('#pageHeader-breadcrumb2').click();

      sleep(testGlobals.sleepTime);

      // should be on the feed election page
      expect(element('#feed-election-content').count()).toBe(1);

    });
  });

  /* ----------------------------------------
   Now from the Feed Election page, click the 2nd breadcrumb
   ------------------------------------------*/
  describe('Click the vip-feed breadcrumb to be taken to the feed overview page', function () {
    // check the the number of feeds
    it('Clicking breadcrumb should go to Feed Overview page', function () {

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
    it('Clicking breadcrumb should go to Feed Index page', function () {

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