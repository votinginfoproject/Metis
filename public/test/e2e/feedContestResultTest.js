/**
 * Created by rcartier13 on 1/30/14.
 */

describe('Testing Feed Contest Results Page', function() {

  describe('Log in', function () {

    // Successful attempt
    //    currently only with local client, need to modify later for crowd
    it('Accepts a proper username + password', function () {
      e2eLogIn('testuser', 'test');
    });
  });

  describe('Contest Results Page is able to be navigated to', function() {
    it('Navigates to the Contest Result page', function() {
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

      element('#contestresult-id a').click();

      expect(element('#pageHeader-alert')).not().toBeDefined();
      expect(element('#feed-contestresult-content').count()).toBe(1);
    });

    it('Has content on the page', function() {
      expect(element('#contest-id').count()).toBe(1);
      expect(element('#jurisdiction-id').count()).toBe(1);
    });

    it('Contest link works', function() {
      element('#contest-id a').click();
      expect(element('#feed-contest-content').count()).toBe(1);
    });

    it('Jurisdiction link works', function() {
      element('#contestresult-id a').click();
      expect(element('#feed-contestresult-content').count()).toBe(1);
      element('#jurisdiction-id a').click();
      expect(element('#feeds-election-contests-electoraldistrict-content-single').count()).toBe(1);
    });
  });

//  describe('Checks if errors were thrown', function() {
//    it('Navigates to Ballot', function() {
//      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election/contests/1contest/contestresult");
//      expect(element('#pageHeader-alert').html()).toBeDefined();
//    });
//  });

  describe('Logs Out', function() {
    it('Logs out', function() {
      e2eLogOut();
    });
  });
});