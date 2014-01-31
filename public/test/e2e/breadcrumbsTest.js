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
      sleep(testGlobals.sleepTime);

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
      sleep(testGlobals.sleepTime);

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
      sleep(testGlobals.sleepTime);

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
      sleep(testGlobals.sleepTime);

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

      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election/state/localities/1local");
      sleep(testGlobals.sleepTime);

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
      expect(element('#pageHeader-breadcrumb5').html()).toBe("1local");

    });
  });

  /* ----------------------------------------
   Feed Precincts page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Precincts page breadcrumb', function () {
    // check the the number of feeds
    it('Should have 7 breadcrumbs', function () {

      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election/state/localities/1local/precincts");
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

      expect(element('#pageHeader-breadcrumb0').html()).toBe("Feeds");
      expect(element('#pageHeader-breadcrumb1').html()).toBe("vip-feed1");
      expect(element('#pageHeader-breadcrumb2').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb3').html()).toBe("State");
      expect(element('#pageHeader-breadcrumb4').html()).toBe("Localities");
      expect(element('#pageHeader-breadcrumb5').html()).toBe("1local");
      expect(element('#pageHeader-breadcrumb6').html()).toBe("Precincts");

    });
  });

  /* ----------------------------------------
   Feed Precinct page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Precinct page breadcrumb', function () {
    // check the the number of feeds
    it('Should have 8 breadcrumbs', function () {

      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election/state/localities/1local/precincts/1precinct");
      sleep(testGlobals.sleepTime);

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
      expect(element('#pageHeader-breadcrumb5').html()).toBe("1local");
      expect(element('#pageHeader-breadcrumb6').html()).toBe("Precincts");
      expect(element('#pageHeader-breadcrumb7').html()).toBe("1precinct");

    });
  });

  /* ----------------------------------------
   Feed Precinct Street Segments Errors page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Precinct Street Segments Errors page breadcrumb', function () {
    // check the the number of breadcrumbs
    it('Should have 10 breadcrumbs', function () {

      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election/state/localities/1local/precincts/1precinct/streetsegments/errors");
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
      expect(element('#pageHeader-breadcrumb10').count()).toBe(0);
    });

    // check the feed breadcrumb values
    it('Breadcrumb values should be correct', function () {

      expect(element('#pageHeader-breadcrumb0').html()).toBe("Feeds");
      expect(element('#pageHeader-breadcrumb1').html()).toBe("vip-feed1");
      expect(element('#pageHeader-breadcrumb2').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb3').html()).toBe("State");
      expect(element('#pageHeader-breadcrumb4').html()).toBe("Localities");
      expect(element('#pageHeader-breadcrumb5').html()).toBe("1local");
      expect(element('#pageHeader-breadcrumb6').html()).toBe("Precincts");
      expect(element('#pageHeader-breadcrumb7').html()).toBe("1precinct");
      expect(element('#pageHeader-breadcrumb8').html()).toBe("Street Segments");
      expect(element('#pageHeader-breadcrumb9').html()).toBe("Errors");

    });
  });

  /* ----------------------------------------
   Feed Precinct Splits page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Precinct Splits page breadcrumb', function () {
    // check the the number of feeds
    it('Should have 9 breadcrumbs', function () {

      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election/state/localities/1local/precincts/1precinct/precinctsplits");
      sleep(testGlobals.sleepTime);
      sleep(2);

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

      expect(element('#pageHeader-breadcrumb0').html()).toBe("Feeds");
      expect(element('#pageHeader-breadcrumb1').html()).toBe("vip-feed1");
      expect(element('#pageHeader-breadcrumb2').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb3').html()).toBe("State");
      expect(element('#pageHeader-breadcrumb4').html()).toBe("Localities");
      expect(element('#pageHeader-breadcrumb5').html()).toBe("1local");
      expect(element('#pageHeader-breadcrumb6').html()).toBe("Precincts");
      expect(element('#pageHeader-breadcrumb7').html()).toBe("1precinct");
      expect(element('#pageHeader-breadcrumb8').html()).toBe("Precinct Splits");
    });
  });

  /* ----------------------------------------
   Feed Contest page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Contest page breadcrumb', function() {
    it('Should have the correct breadcrumbs', function () {
      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election/contests/1contest");

      expect(element('#pageHeader-breadcrumb0').html()).toBe("Feeds");
      expect(element('#pageHeader-breadcrumb1').html()).toBe("vip-feed1");
      expect(element('#pageHeader-breadcrumb2').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb3').html()).toBe("Contests");
      expect(element('#pageHeader-breadcrumb4').html()).toBe("1contest");
    });
  });

  /* ----------------------------------------
   Feed Contests page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Contests page breadcrumb', function() {
    it('Should have the correct breadcrumbs', function () {

      element('#pageHeader-breadcrumb3').click();
      sleep(testGlobals.sleepTime);

      expect(element('#pageHeader-breadcrumb0').html()).toBe("Feeds");
      expect(element('#pageHeader-breadcrumb1').html()).toBe("vip-feed1");
      expect(element('#pageHeader-breadcrumb2').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb3').html()).toBe("Contests");
    });
  });

  /* ----------------------------------------
   Feed Ballot page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Ballot page breadcrumb', function() {
    it('Should have the correct breadcrumbs', function() {
      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election/contests/1contest/ballot");

      expect(element('#pageHeader-breadcrumb0').html()).toBe("Feeds");
      expect(element('#pageHeader-breadcrumb1').html()).toBe("vip-feed1");
      expect(element('#pageHeader-breadcrumb2').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb3').html()).toBe("Contests");
      expect(element('#pageHeader-breadcrumb4').html()).toBe("1contest");
      expect(element('#pageHeader-breadcrumb5').html()).toBe("Ballot");
    });
  });

  /* ----------------------------------------
   Feed Candidate page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Candidate page breadcrumb', function() {
    it('Should have the correct breadcrumbs', function () {
      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election/contests/1contest/ballot/candidates/1candidate");

      expect(element('#pageHeader-breadcrumb0').html()).toBe("Feeds");
      expect(element('#pageHeader-breadcrumb1').html()).toBe("vip-feed1");
      expect(element('#pageHeader-breadcrumb2').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb3').html()).toBe("Contests");
      expect(element('#pageHeader-breadcrumb4').html()).toBe("1contest");
      expect(element('#pageHeader-breadcrumb5').html()).toBe("Ballot");
      expect(element('#pageHeader-breadcrumb6').html()).toBe("Candidates");
      expect(element('#pageHeader-breadcrumb7').html()).toBe("1candidate");
    });
  });

  /* ----------------------------------------
   Feed Candidates page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Candidates page breadcrumb', function() {
    it('Should have the correct breadcrumbs', function () {

      element('#pageHeader-breadcrumb6').click();
      sleep(testGlobals.sleepTime);

      expect(element('#pageHeader-breadcrumb0').html()).toBe("Feeds");
      expect(element('#pageHeader-breadcrumb1').html()).toBe("vip-feed1");
      expect(element('#pageHeader-breadcrumb2').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb3').html()).toBe("Contests");
      expect(element('#pageHeader-breadcrumb4').html()).toBe("1contest");
      expect(element('#pageHeader-breadcrumb5').html()).toBe("Ballot");
      expect(element('#pageHeader-breadcrumb6').html()).toBe("Candidates");
    });
  });

  /* ----------------------------------------
   Feed Referendum page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Referendum page breadcrumb', function() {
    it('Should have the correct breadcrumbs', function () {
      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election/contests/1contest/ballot/referenda/1referendum");

      expect(element('#pageHeader-breadcrumb0').html()).toBe("Feeds");
      expect(element('#pageHeader-breadcrumb1').html()).toBe("vip-feed1");
      expect(element('#pageHeader-breadcrumb2').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb3').html()).toBe("Contests");
      expect(element('#pageHeader-breadcrumb4').html()).toBe("1contest");
      expect(element('#pageHeader-breadcrumb5').html()).toBe("Ballot");
      expect(element('#pageHeader-breadcrumb6').html()).toBe("Referenda");
      expect(element('#pageHeader-breadcrumb7').html()).toBe("1referendum");
    });
  });

  /* ----------------------------------------
   Feed Referenda page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Referenda page breadcrumb', function() {
    it('Should have the correct breadcrumbs', function () {

      element('#pageHeader-breadcrumb6').click();
      sleep(testGlobals.sleepTime);

      expect(element('#pageHeader-breadcrumb0').html()).toBe("Feeds");
      expect(element('#pageHeader-breadcrumb1').html()).toBe("vip-feed1");
      expect(element('#pageHeader-breadcrumb2').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb3').html()).toBe("Contests");
      expect(element('#pageHeader-breadcrumb4').html()).toBe("1contest");
      expect(element('#pageHeader-breadcrumb5').html()).toBe("Ballot");
      expect(element('#pageHeader-breadcrumb6').html()).toBe("Referenda");
    });
  });

  /* ----------------------------------------
   Feed Contest Result page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Contest Result page breadcrumb', function() {
    it('Should have the correct breadcrumbs', function () {
      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election/contests/1contest/contestresult");

      expect(element('#pageHeader-breadcrumb0').html()).toBe("Feeds");
      expect(element('#pageHeader-breadcrumb1').html()).toBe("vip-feed1");
      expect(element('#pageHeader-breadcrumb2').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb3').html()).toBe("Contests");
      expect(element('#pageHeader-breadcrumb4').html()).toBe("1contest");
      expect(element('#pageHeader-breadcrumb5').html()).toBe("Contestresult");
    });
  });

  /* ----------------------------------------
   Feed Ballot Line Result page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Ballot Line Result page breadcrumb', function() {
    it('Should have the correct breadcrumbs', function () {
      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election/contests/1contest/ballotlineresults/1ballotlineresult");

      expect(element('#pageHeader-breadcrumb0').html()).toBe("Feeds");
      expect(element('#pageHeader-breadcrumb1').html()).toBe("vip-feed1");
      expect(element('#pageHeader-breadcrumb2').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb3').html()).toBe("Contests");
      expect(element('#pageHeader-breadcrumb4').html()).toBe("1contest");
      expect(element('#pageHeader-breadcrumb5').html()).toBe("Ballotlineresults");
      expect(element('#pageHeader-breadcrumb6').html()).toBe("1ballotlineresult");
    });
  });

  /* ----------------------------------------
   Feed Ballot Line Results page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Ballot Line Results page breadcrumb', function() {
    it('Should have the correct breadcrumbs', function () {
      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election/contests/1contest/ballotlineresults");

      element('#pageHeader-breadcrumb5').click();

      expect(element('#pageHeader-breadcrumb0').html()).toBe("Feeds");
      expect(element('#pageHeader-breadcrumb1').html()).toBe("vip-feed1");
      expect(element('#pageHeader-breadcrumb2').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb3').html()).toBe("Contests");
      expect(element('#pageHeader-breadcrumb4').html()).toBe("1contest");
      expect(element('#pageHeader-breadcrumb5').html()).toBe("Ballotlineresults");
    });
  });

  /* ----------------------------------------
   Feed Precinct Split page breadcrumb
   ------------------------------------------*/
  describe('Check Feed Precinct Split page breadcrumb', function () {
    // check the the number of feeds
    it('Should have 10 breadcrumbs', function () {

      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election/state/localities/1local/precincts/1precinct/precinctsplits/1precinctsplit");
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
      expect(element('#pageHeader-breadcrumb10').count()).toBe(0);
    });

    // check the feed breadcrumb values
    it('Breadcrumb values should be correct', function () {

      expect(element('#pageHeader-breadcrumb0').html()).toBe("Feeds");
      expect(element('#pageHeader-breadcrumb1').html()).toBe("vip-feed1");
      expect(element('#pageHeader-breadcrumb2').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb3').html()).toBe("State");
      expect(element('#pageHeader-breadcrumb4').html()).toBe("Localities");
      expect(element('#pageHeader-breadcrumb5').html()).toBe("1local");
      expect(element('#pageHeader-breadcrumb6').html()).toBe("Precincts");
      expect(element('#pageHeader-breadcrumb7').html()).toBe("1precinct");
      expect(element('#pageHeader-breadcrumb8').html()).toBe("Precinct Splits");
      expect(element('#pageHeader-breadcrumb9').html()).toBe("1precinctsplit");
    });
  });

  /* ----------------------------------------
   Feed Precinct Split Street Segments Errors page
   ------------------------------------------*/
  describe('Check Feed Precinct Split Street Segments Errors page breadcrumb', function () {
    // check the the number of feeds
    it('Should have 12 breadcrumbs', function () {

      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election/state/localities/1local/precincts/1precinct/precinctsplits/1precinctsplit/streetsegments/errors");
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
      expect(element('#pageHeader-breadcrumb11').count()).toBe(1);
      expect(element('#pageHeader-breadcrumb12').count()).toBe(0);
    });

    // check the feed breadcrumb values
    it('Breadcrumb values should be correct', function () {

      expect(element('#pageHeader-breadcrumb0').html()).toBe("Feeds");
      expect(element('#pageHeader-breadcrumb1').html()).toBe("vip-feed1");
      expect(element('#pageHeader-breadcrumb2').html()).toBe("Election");
      expect(element('#pageHeader-breadcrumb3').html()).toBe("State");
      expect(element('#pageHeader-breadcrumb4').html()).toBe("Localities");
      expect(element('#pageHeader-breadcrumb5').html()).toBe("1local");
      expect(element('#pageHeader-breadcrumb6').html()).toBe("Precincts");
      expect(element('#pageHeader-breadcrumb7').html()).toBe("1precinct");
      expect(element('#pageHeader-breadcrumb8').html()).toBe("Precinct Splits");
      expect(element('#pageHeader-breadcrumb9').html()).toBe("1precinctsplit");
      expect(element('#pageHeader-breadcrumb10').html()).toBe("Street Segments");
      expect(element('#pageHeader-breadcrumb11').html()).toBe("Errors");
    });
  });


  /* ----------------------------------------
   Start from the Feed Precinct Split page
   ------------------------------------------*/
  describe('Start from the Feed Precinct Split page', function () {
    // check the the number of feeds
    it('Start from the Feed Precinct Split page', function () {

      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election/state/localities/1local/precincts/1precinct/precinctsplits/1precinctsplit");
      sleep(testGlobals.sleepTime);
    });

  });

  /* ----------------------------------------
   Now from the Feed Precinct Split page, click the 9th breadcrumb
   ------------------------------------------*/
  describe('Click the Precinct Splits breadcrumb to be taken to the feed Precinct Splits page', function () {

    it('Clicking breadcrumb should go to Feed Precinct Splits page', function () {

      // click 9th breadcrumb
      element('#pageHeader-breadcrumb8').click();

      sleep(testGlobals.sleepTime);

      // should be on the feed precinct splits page
      expect(element('#feed-precinctsplits-content').count()).toBe(1);

    });
  });

  /* ----------------------------------------
   Now from the Feed Precinct Splits page, click the 8th breadcrumb
   ------------------------------------------*/
  describe('Click the Precinct breadcrumb to be taken to the feed Precinct page', function () {

    it('Clicking breadcrumb should go to Feed Precinct page', function () {

      // click 8th breadcrumb
      element('#pageHeader-breadcrumb7').click();

      sleep(testGlobals.sleepTime);

      // should be on the feed locality page
      expect(element('#feed-precinct-content').count()).toBe(1);

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