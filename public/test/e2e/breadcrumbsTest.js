describe('Breadcrumbs Test', function () {


  describe('Log in', function () {

    // Successful attempt
    //    currently only with local client, need to modify later for crowd
    it('Accepts a proper username + password', function () {
      e2eLogIn('testuser', 'test');
    });
  });

  /* ----------------------------------------
   Feed Overview page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Source page breadcrumb', function () {
    // check the the number of feeds
    it('Should have 2 breadcrumbs', function () {

      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/2014-04-10-Federal-Ohio-1");
      sleep(testGlobals.sleepTime);

      expect(element('#pageHeader-breadcrumb0').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb1').count()).toBe(0);
    });

    // check the feed breadcrumb values
    it('Breadcrumb values should be correct', function () {

      expect(element('#pageHeader-breadcrumb0 a').html()).toBe("2014-04-10 Federal Ohio");

    });
  });

  /* ----------------------------------------
   Feed Source page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Source page breadcrumb', function () {
    // check the the number of feeds
    it('Should have 2 breadcrumbs', function () {

      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/2014-04-10-Federal-Ohio-1/source");
      sleep(testGlobals.sleepTime);

      expect(element('#pageHeader-breadcrumb0').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb1').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb2').count()).toBe(0);
    });

    // check the feed breadcrumb values
    it('Breadcrumb values should be correct', function () {

      expect(element('#pageHeader-breadcrumb0 a').html()).toBe("2014-04-10 Federal Ohio");
      expect(element('#pageHeader-breadcrumb1 a').html()).toBe("Source &amp; Election");

    });
  });

  /* ----------------------------------------
   Feed Polling Locations page breadcrumb
   ------------------------------------------*/
  describe('Check Feed State page breadcrumb', function () {
    // check the the number of feeds
    it('Should have 3 breadcrumbs', function () {

      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/2014-04-10-Federal-Ohio-1/election/state");
      sleep(testGlobals.sleepTime);

      expect(element('#pageHeader-breadcrumb0').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb1').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb2').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb3').count()).toBe(0);
    });

    // check the feed breadcrumb values
    it('Breadcrumb values should be correct', function () {

      expect(element('#pageHeader-breadcrumb0 a').html()).toBe("2014-04-10 Federal Ohio");
      expect(element('#pageHeader-breadcrumb1 a').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb2 a').html()).toBe("State");

    });
  });

  /* ----------------------------------------
   Feed Localities page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Localities page breadcrumb', function () {
    // check the the number of feeds
    it('Should have 4 breadcrumbs', function () {

      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/2014-04-10-Federal-Ohio-1/election/state/localities");
      sleep(testGlobals.sleepTime);

      expect(element('#pageHeader-breadcrumb0').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb1').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb2').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb3').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb4').count()).toBe(0);
    });

    // check the feed breadcrumb values
    it('Breadcrumb values should be correct', function () {

      expect(element('#pageHeader-breadcrumb0 a').html()).toBe("2014-04-10 Federal Ohio");
      expect(element('#pageHeader-breadcrumb1 a').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb2 a').html()).toBe("State");
      expect(element('#pageHeader-breadcrumb3 a').html()).toBe("Localities");

    });
  });

  /* ----------------------------------------
   Feed Locality page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Locality page breadcrumb', function () {
    // check the the number of feeds
    it('Should have 5 breadcrumbs', function () {

      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/2014-04-10-Federal-Ohio-1/election/state/localities/101");
      sleep(testGlobals.sleepTime);

      expect(element('#pageHeader-breadcrumb0').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb1').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb2').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb3').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb4').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb5').count()).toBe(0);
    });

    // check the feed breadcrumb values
    it('Breadcrumb values should be correct', function () {

      expect(element('#pageHeader-breadcrumb0 a').html()).toBe("2014-04-10 Federal Ohio");
      expect(element('#pageHeader-breadcrumb1 a').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb2 a').html()).toBe("State");
      expect(element('#pageHeader-breadcrumb3 a').html()).toBe("Localities");
      expect(element('#pageHeader-breadcrumb4 a').html()).toBe("101");

    });
  });

  /* ----------------------------------------
   Feed Precinct page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Precinct page breadcrumb', function () {
    // check the the number of feeds
    it('Should have 7 breadcrumbs', function () {

      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/2014-04-10-Federal-Ohio-1/election/state/localities/101/precincts/10101");
      sleep(testGlobals.sleepTime);

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

      expect(element('#pageHeader-breadcrumb0 a').html()).toBe("2014-04-10 Federal Ohio");
      expect(element('#pageHeader-breadcrumb1 a').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb2 a').html()).toBe("State");
      expect(element('#pageHeader-breadcrumb3 a').html()).toBe("Localities");
      expect(element('#pageHeader-breadcrumb4 a').html()).toBe("101");
      expect(element('#pageHeader-breadcrumb5 a').html()).toBe("Precincts");
      expect(element('#pageHeader-breadcrumb6 a').html()).toBe("10101");

    });
  });

  /* ----------------------------------------
   Feed Precinct Street Segments Errors page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Precinct Street Segments Errors page breadcrumb', function () {
    // check the the number of breadcrumbs
    it('Should have 9 breadcrumbs', function () {

      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/2014-04-10-Federal-Ohio-1/election/state/localities/101/precincts/10101/streetsegments/errors");
      sleep(testGlobals.sleepTime);

      expect(element('#pageHeader-breadcrumb0').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb1').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb2').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb3').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb4').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb5').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb6').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb7').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb8').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb9').count()).toBe(0);
    });

    // check the feed breadcrumb values
    it('Breadcrumb values should be correct', function () {

      expect(element('#pageHeader-breadcrumb0 a').html()).toBe("2014-04-10 Federal Ohio");
      expect(element('#pageHeader-breadcrumb1 a').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb2 a').html()).toBe("State");
      expect(element('#pageHeader-breadcrumb3 a').html()).toBe("Localities");
      expect(element('#pageHeader-breadcrumb4 a').html()).toBe("101");
      expect(element('#pageHeader-breadcrumb5 a').html()).toBe("Precincts");
      expect(element('#pageHeader-breadcrumb6 a').html()).toBe("10101");
      expect(element('#pageHeader-breadcrumb7 a').html()).toBe("Street Segments");
      expect(element('#pageHeader-breadcrumb8 a').html()).toBe("Errors");

    });
  });

  /* ----------------------------------------
   Feed Contest page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Contest page breadcrumb', function() {
    it('Should have the correct breadcrumbs', function () {
      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/2014-04-10-Federal-Ohio-1/election/contests/60001");

      expect(element('#pageHeader-breadcrumb0 a').html()).toBe("2014-04-10 Federal Ohio");
      expect(element('#pageHeader-breadcrumb1 a').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb2 a').html()).toBe("Contests");
      expect(element('#pageHeader-breadcrumb3 a').html()).toBe("60001");
    });
  });

  /* ----------------------------------------
   Feed Contests page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Contests page breadcrumb', function() {
    it('Should have the correct breadcrumbs', function () {

      element('#pageHeader-breadcrumb3 a').click();
      sleep(testGlobals.sleepTime);

      expect(element('#pageHeader-breadcrumb0 a').html()).toBe("2014-04-10 Federal Ohio");
      expect(element('#pageHeader-breadcrumb1 a').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb2 a').html()).toBe("Contests");
    });
  });

  /* ----------------------------------------
   Feed Ballot page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Ballot page breadcrumb', function() {
    it('Should have the correct breadcrumbs', function() {
      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/2014-04-10-Federal-Ohio-1/election/contests/60001/ballot");

      expect(element('#pageHeader-breadcrumb0 a').html()).toBe("2014-04-10 Federal Ohio");
      expect(element('#pageHeader-breadcrumb1 a').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb2 a').html()).toBe("Contests");
      expect(element('#pageHeader-breadcrumb3 a').html()).toBe("60001");
      expect(element('#pageHeader-breadcrumb4 a').html()).toBe("Ballot");
    });
  });

  /* ----------------------------------------
   Feed Candidate page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Candidate page breadcrumb', function() {
    it('Should have the correct breadcrumbs', function () {
      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/2014-04-10-Federal-Ohio-1/election/contests/60001/ballot/candidates/90001");

      expect(element('#pageHeader-breadcrumb0 a').html()).toBe("2014-04-10 Federal Ohio");
      expect(element('#pageHeader-breadcrumb1 a').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb2 a').html()).toBe("Contests");
      expect(element('#pageHeader-breadcrumb3 a').html()).toBe("60001");
      expect(element('#pageHeader-breadcrumb4 a').html()).toBe("Ballot");
      expect(element('#pageHeader-breadcrumb5 a').html()).toBe("Candidates");
      expect(element('#pageHeader-breadcrumb6 a').html()).toBe("90001");
    });
  });

  /* ----------------------------------------
   Feed Candidates page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Candidates page breadcrumb', function() {
    it('Should have the correct breadcrumbs', function () {

      element('#pageHeader-breadcrumb6 a').click();
      sleep(testGlobals.sleepTime);

      expect(element('#pageHeader-breadcrumb0 a').html()).toBe("2014-04-10 Federal Ohio");
      expect(element('#pageHeader-breadcrumb1 a').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb2 a').html()).toBe("Contests");
      expect(element('#pageHeader-breadcrumb3 a').html()).toBe("60001");
      expect(element('#pageHeader-breadcrumb4 a').html()).toBe("Ballot");
      expect(element('#pageHeader-breadcrumb5 a').html()).toBe("Candidates");
    });
  });

  /* ----------------------------------------
   Feed Referendum page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Referendum page breadcrumb', function() {
    it('Should have the correct breadcrumbs', function () {
      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/2014-04-10-Federal-Ohio-1/election/contests/60006/ballot/referenda/90011");

      expect(element('#pageHeader-breadcrumb0 a').html()).toBe("2014-04-10 Federal Ohio");
      expect(element('#pageHeader-breadcrumb1 a').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb2 a').html()).toBe("Contests");
      expect(element('#pageHeader-breadcrumb3 a').html()).toBe("60006");
      expect(element('#pageHeader-breadcrumb4 a').html()).toBe("Ballot");
      expect(element('#pageHeader-breadcrumb5 a').html()).toBe("Referenda");
      expect(element('#pageHeader-breadcrumb6 a').html()).toBe("90011");
    });
  });

  /* ----------------------------------------
   Feed Referenda page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Referenda page breadcrumb', function() {
    it('Should have the correct breadcrumbs', function () {

      element('#pageHeader-breadcrumb6 a').click();
      sleep(testGlobals.sleepTime);

      expect(element('#pageHeader-breadcrumb0 a').html()).toBe("2014-04-10 Federal Ohio");
      expect(element('#pageHeader-breadcrumb1 a').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb2 a').html()).toBe("Contests");
      expect(element('#pageHeader-breadcrumb3 a').html()).toBe("60006");
      expect(element('#pageHeader-breadcrumb4 a').html()).toBe("Ballot");
      expect(element('#pageHeader-breadcrumb5 a').html()).toBe("Referenda");
    });
  });

  /* ----------------------------------------
   Feed Contest Result page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Contest Result page breadcrumb', function() {
    it('Should have the correct breadcrumbs', function () {
      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/2014-04-10-Federal-Ohio-1/election/contests/60001/contestresult");

      expect(element('#pageHeader-breadcrumb0 a').html()).toBe("2014-04-10 Federal Ohio");
      expect(element('#pageHeader-breadcrumb1 a').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb2 a').html()).toBe("Contests");
      expect(element('#pageHeader-breadcrumb3 a').html()).toBe("60001");
      expect(element('#pageHeader-breadcrumb4 a').html()).toBe("Contest Result");
    });
  });

  /* ----------------------------------------
   Feed Ballot Line Result page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Ballot Line Result page breadcrumb', function() {
    it('Should have the correct breadcrumbs', function () {
      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/2014-04-10-Federal-Ohio-1/election/contests/60001/ballotlineresults/91008");

      expect(element('#pageHeader-breadcrumb0 a').html()).toBe("2014-04-10 Federal Ohio");
      expect(element('#pageHeader-breadcrumb1 a').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb2 a').html()).toBe("Contests");
      expect(element('#pageHeader-breadcrumb3 a').html()).toBe("60001");
      expect(element('#pageHeader-breadcrumb4 a').html()).toBe("Ballot Line Results");
      expect(element('#pageHeader-breadcrumb5 a').html()).toBe("91008");
    });
  });

  /* ----------------------------------------
   Feed Ballot Line Results page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Ballot Line Results page breadcrumb', function() {
    it('Should have the correct breadcrumbs', function () {
      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/2014-04-10-Federal-Ohio-1/election/contests/60001/ballotlineresults");

      expect(element('#pageHeader-breadcrumb0 a').html()).toBe("2014-04-10 Federal Ohio");
      expect(element('#pageHeader-breadcrumb1 a').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb2 a').html()).toBe("Contests");
      expect(element('#pageHeader-breadcrumb3 a').html()).toBe("60001");
      expect(element('#pageHeader-breadcrumb4 a').html()).toBe("Ballot Line Results");
    });
  });

  /* ----------------------------------------
   Feed Precinct Split page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Precinct Split page breadcrumb', function () {
    // check the the number of feeds
    it('Should have 9 breadcrumbs', function () {

      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/2014-04-10-Federal-Ohio-1/election/state/localities/103/precincts/10302/precinctsplits/111");
      sleep(testGlobals.sleepTime);

      expect(element('#pageHeader-breadcrumb0').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb1').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb2').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb3').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb4').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb5').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb6').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb7').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb8').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb9').count()).toBe(0);
    });

    // check the feed breadcrumb values
    it('Breadcrumb values should be correct', function () {

      expect(element('#pageHeader-breadcrumb0 a').html()).toBe("2014-04-10 Federal Ohio");
      expect(element('#pageHeader-breadcrumb1 a').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb2 a').html()).toBe("State");
      expect(element('#pageHeader-breadcrumb3 a').html()).toBe("Localities");
      expect(element('#pageHeader-breadcrumb4 a').html()).toBe("103");
      expect(element('#pageHeader-breadcrumb5 a').html()).toBe("Precincts");
      expect(element('#pageHeader-breadcrumb6 a').html()).toBe("10302");
      expect(element('#pageHeader-breadcrumb7 a').html()).toBe("Precinct Splits");
      expect(element('#pageHeader-breadcrumb8 a').html()).toBe("111");
    });
  });

  /* ----------------------------------------
   Feed Precinct Split Street Segments Errors page
   ------------------------------------------*/
  describe('Check Feed Precinct Split Street Segments Errors page breadcrumb', function () {
    // check the the number of feeds
    it('Should have 11 breadcrumbs', function () {

      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/2014-04-10-Federal-Ohio-1/election/state/localities/103/precincts/10302/precinctsplits/111/streetsegments/errors");
      sleep(testGlobals.sleepTime);

      expect(element('#pageHeader-breadcrumb0').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb1').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb2').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb3').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb4').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb5').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb6').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb7').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb8').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb9').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb10').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb11').count()).toBe(0);
    });

    // check the feed breadcrumb values
    it('Breadcrumb values should be correct', function () {

      expect(element('#pageHeader-breadcrumb0 a').html()).toBe("2014-04-10 Federal Ohio");
      expect(element('#pageHeader-breadcrumb1 a').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb2 a').html()).toBe("State");
      expect(element('#pageHeader-breadcrumb3 a').html()).toBe("Localities");
      expect(element('#pageHeader-breadcrumb4 a').html()).toBe("103");
      expect(element('#pageHeader-breadcrumb5 a').html()).toBe("Precincts");
      expect(element('#pageHeader-breadcrumb6 a').html()).toBe("10302");
      expect(element('#pageHeader-breadcrumb7 a').html()).toBe("Precinct Splits");
      expect(element('#pageHeader-breadcrumb8 a').html()).toBe("111");
      expect(element('#pageHeader-breadcrumb9 a').html()).toBe("Street Segments");
      expect(element('#pageHeader-breadcrumb10 a').html()).toBe("Errors");
    });
  });


  /* ----------------------------------------
   Start from the Feed Precinct Split page
   ------------------------------------------*/
  describe('Start from the Feed Precinct Split page', function () {
    // check the the number of feeds
    it('Start from the Feed Precinct Split page', function () {

      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/2014-04-10-Federal-Ohio-1/election/state/localities/103/precincts/10302/precinctsplits/111");
      sleep(testGlobals.sleepTime);
    });

  });

  /* ----------------------------------------
   Now from the Feed Precinct Split page, click the 8th breadcrumb
   ------------------------------------------*/
  describe('Click the Precinct Splits breadcrumb to be taken to the feed Precinct Splits page', function () {

    it('Clicking breadcrumb should go to Feed Precinct Splits page', function () {

      // click 9th breadcrumb
      element('#pageHeader-breadcrumb7 a').click();

      sleep(testGlobals.sleepTime);

      // should be on the feed precinct splits page
      expect(element('#feed-precinctsplits-content').count()).toBe(1);

    });
  });

  /* ----------------------------------------
   Now from the Feed Precinct Splits page, click the 7th breadcrumb
   ------------------------------------------*/
  describe('Click the Precinct breadcrumb to be taken to the feed Precinct page', function () {

    it('Clicking breadcrumb should go to Feed Precinct page', function () {

      // click 8th breadcrumb
      element('#pageHeader-breadcrumb6 a').click();

      sleep(testGlobals.sleepTime);

      // should be on the feed locality page
      expect(element('#feed-precinct-content').count()).toBe(1);

    });
  });

   /* ----------------------------------------
   Now from the Feed Precinct page, click the 6th breadcrumb
   ------------------------------------------*/
  describe('Click the Precincts breadcrumb to be taken to the feed Precincts page', function () {

    it('Clicking breadcrumb should go to Feed Precincts page', function () {

      // click 7th breadcrumb
      element('#pageHeader-breadcrumb5 a').click();

      sleep(testGlobals.sleepTime);

      // should be on the feed precincts page
      expect(element('#feed-precincts-content').count()).toBe(1);

    });
  });

  /* ----------------------------------------
   Now from the Feed Precincts page, click the 5th breadcrumb
   ------------------------------------------*/
  describe('Click the Locality breadcrumb to be taken to the feed Locality page', function () {

    it('Clicking breadcrumb should go to Feed Locality page', function () {

      // click 6th breadcrumb
      element('#pageHeader-breadcrumb4 a').click();

      sleep(testGlobals.sleepTime);

      // should be on the feed locality page
      expect(element('#feed-locality-content').count()).toBe(1);

    });
  });

  /* ----------------------------------------
   Now from the Feed Locality page, click the 4th breadcrumb
   ------------------------------------------*/
  describe('Click the Localities breadcrumb to be taken to the feed Localities page', function () {

    it('Clicking breadcrumb should go to Feed Localities page', function () {

      // click 5th breadcrumb
      element('#pageHeader-breadcrumb3 a').click();

      sleep(testGlobals.sleepTime);

      // should be on the feed state page
      expect(element('#feed-localities-content').count()).toBe(1);

    });
  });

  /* ----------------------------------------
   Now from the Feed Localities page, click the 3rd breadcrumb
   ------------------------------------------*/
  describe('Click the State breadcrumb to be taken to the feed State page', function () {

    it('Clicking breadcrumb should go to Feed State page', function () {

      // click 4th breadcrumb
      element('#pageHeader-breadcrumb2 a').click();

      sleep(testGlobals.sleepTime);

      // should be on the feed state page
      expect(element('#feed-state-content').count()).toBe(1);

    });
  });

  /* ----------------------------------------
   Now from the Feed State page, click the 2nd breadcrumb
   ------------------------------------------*/
  describe('Click the Election breadcrumb to be taken to the feed Election page', function () {
    // check the the number of feeds
    it('Clicking breadcrumb should go to Feed Election page', function () {

      // click 3rd breadcrumb
      element('#pageHeader-breadcrumb1 a').click();

      sleep(testGlobals.sleepTime);

      // should be on the feed election page
      expect(element('#feed-election-content').count()).toBe(1);

    });
  });

  /* ----------------------------------------
   Now from the Feed Election page, click the 1st breadcrumb
   ------------------------------------------*/
  describe('Click the vip-feed breadcrumb to be taken to the feed overview page', function () {
    // check the the number of feeds
    it('Clicking breadcrumb should go to Feed Overview page', function () {

      // click 2nd breadcrumb
      element('#pageHeader-breadcrumb0 a').click();

      sleep(testGlobals.sleepTime);

      // should be on the feed overview page
      expect(element('#feed-overview-content').count()).toBe(1);

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
