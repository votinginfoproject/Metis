/**
 * Created by rcartier13 on 1/22/14.
 */

describe('Testing Feed Contest Page', function() {

  describe('Log in', function () {

    // Successful attempt
    //    currently only with local client, need to modify later for crowd
    it('Accepts a proper username + password', function () {
      e2eLogIn('testuser', 'test');
    });
  });

  describe('Contest Page is able to be navigated to', function() {
    it('Navigates to Contest', function() {
      // expect to start out on the feed index page
      // click the first feed
      element('#date0 a').click();
      sleep(testGlobals.sleepTime);

      /*
       expect(element('#election-link').count()).toBe(1);

       // click the election link
       element('#election-link').click();
       sleep(testGlobals.sleepTime);
       */

      expect(element('#sidebar-election').count()).toBe(1);

      // click the election link
      element('#sidebar-election').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed election page
      expect(element('#feed-election-content').count()).toBe(1);

      element('#contests-id0 a').click();

      expect(element('#pageHeader-alert')).not().toBeDefined();
      expect(element('#feed-contest-content').count()).toBe(1);
    });

    it('Has content on the page', function() {
      expect(element('#ballot-id').count()).toBe(1);
      expect(element('#electoraldistrict-id').count()).toBe(1);
      expect(element('#contestresult-id').count()).toBe(1);
      expect(element('#ballotlineresult-id0').count()).toBe(1);
    });

    it('Contest error page link works', function() {
      element('#contest-errors').click();
      expect(element('#feeds-election-contests-errors-content').count()).toBe(1);
      element('#pageHeader-breadcrumb4 a').click();
    })
  });


  /* ----------------------------------------
   Now from the Feed Contest page, click the first Electoral District link
   ------------------------------------------*/
  describe('Click the Contest first Electoral District link', function () {

    it('Click and go to the Electoral District page', function () {

      // Should have Electoral District link
      expect(element('#electoraldistrict-id a').count()).toBe(1);

      // click the link
      element('#electoraldistrict-id a').click();

      sleep(testGlobals.sleepTime);

      // should be on the Contest Electoral District page
      expect(element('#feeds-election-contests-electoraldistrict-content-single').count()).toBe(1);

    });
  });

  /* ----------------------------------------
   Should have Contest Electoral District data
   ------------------------------------------*/
  describe('Should have Contest Electoral District data', function () {

    it('Should have Contest Electoral District data', function () {

      // expect data
      expect(element('#name').count()).toBe(1);

      // expect data for the first Contests row
      expect(element('#contests0').count()).toBe(1);

      // expect data for the first Precincts row
      expect(element('#precinct0').count()).toBe(1);

      // expect data for the first Precinct Splits row
      expect(element('#precinctSplit0').count()).toBe(1);

    });
  });

  describe('Check error page link', function() {
    it('Error page link works', function() {
      element('#electoraldistrict-errors').click();
      expect(element('#feeds-election-contests-electoraldistrict-errors-content').count()).toBe(1);
      element('#pageHeader-breadcrumb5 a').click();
      expect(element('#feeds-election-contests-electoraldistrict-content-single').count()).toBe(1);
    });
  });

  /* ----------------------------------------
   Now from the Feed Contest Electoral District page, click to the Contest page via the breadcrumb
   ------------------------------------------*/
  describe('Click the Contest breadcrumb', function () {

    it('Click and go to the Contest page', function () {

      // Should have Contest breadcrumb
      expect(element('#pageHeader-breadcrumb4').count()).toBe(1);

      // click the link
      element('#pageHeader-breadcrumb4 a').click();

      sleep(testGlobals.sleepTime);

      // should be on the Contest Electoral Districts page
      expect(element('#feed-contest-content').count()).toBe(1);

    });
  });

  describe('Checks if errors are thrown', function() {
    it('Navigates to Contests', function() {
      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election/contests/1contest");
      expect(element('#pageHeader-alert').html()).toBeDefined();
    });
  });

  describe('Logs Out', function() {
    it('Logs out', function() {
      e2eLogOut();
    });
  });
});


describe('Testing Feed Contests Page', function() {

  describe('Log in', function () {

    // Successful attempt
    //    currently only with local client, need to modify later for crowd
    it('Accepts a proper username + password', function () {
      e2eLogIn('testuser', 'test');
    });
  });

  describe('Contests Page is able to be navigated to', function() {
    it('Navigates to Contests', function() {
      // expect to start out on the feed index page
      // click the first feed
      element('#date0 a').click();
      sleep(testGlobals.sleepTime);

      /*
       expect(element('#election-link').count()).toBe(1);

       // click the election link
       element('#election-link').click();
       sleep(testGlobals.sleepTime);
       */

      expect(element('#sidebar-election').count()).toBe(1);

      // click the election link
      element('#sidebar-election').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed election page
      expect(element('#feed-election-content').count()).toBe(1);

      element('#contests-id0 a').click();

      expect(element('#feed-contest-content').count()).toBe(1);

      element('#pageHeader-breadcrumb3 a').click();

      expect(element('#pageHeader-alert')).not().toBeDefined();
      expect(element('#feed-contests-content').count()).toBe(1);
    });

    it('Has Content on the page', function() {
      expect(element('#contests-id0').count()).toBe(1);
    });
  });

  describe('Checks if errors are thrown', function() {
    it('Navigates to Contests', function() {
      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election/contests/");
      expect(element('#pageHeader-alert').html()).toBeDefined();
    });
  });

  describe('Logs Out', function() {
    it('Logs out', function() {
      e2eLogOut();
    });
  });
});

