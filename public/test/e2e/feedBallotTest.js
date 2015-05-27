/**
 * Created by rcartier13 on 1/28/14.
 */

describe('Testing Feed Ballot Page', function() {

  describe('Log in', function () {

    // Successful attempt
    //    currently only with local client, need to modify later for crowd
    it('Accepts a proper username + password', function () {
      e2eLogIn('testuser', 'test');
    });
  });

  describe('Ballot Page is able to be navigated to', function() {
    it('Navigates to Contest', function() {
      // expect to start out on the feed index page
      // click the first feed
      element('#date0 a').click();
      sleep(testGlobals.sleepTime);

      /*
       expect(element('#election-link').count()).toBe(1);

       // click the contests link
       element('#election-link').click();
       sleep(testGlobals.sleepTime);
       */

      expect(element('#sidebar-contests').count()).toBe(1);

      // click the contests link
      element('#sidebar-contests').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed election page
      expect(element('#feed-contests-content').count()).toBe(1);

      element('#contests-id0 a').click();

      expect(element('#feed-contest-content').count()).toBe(1);

      element('#ballot-id a').click();

      expect(element('#pageHeader-alert')).not().toBeDefined();
      expect(element('#feed-ballot-content').count()).toBe(1);
    });

    it('Has content on the page', function() {
      expect(element('#ballotcandidates-id0').count()).toBe(1);
      expect(element('#referendum-id0').count()).toBe(1);
      expect(element('#customballot-heading').count()).toBe(1);
      expect(element('#response-id0').count()).toBe(1);
    });
  });

  describe('Checks the error page link', function() {
    it('Error page link works', function() {
      element('#ballot-errors').click();
      expect(element('#feeds-election-contests-ballot-errors-content').count()).toBe(1);
    });
  });

//  describe('Checks if errors were thrown', function() {
//    it('Navigates to Ballot', function() {
//      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election/contests/1contest/ballot");
//      expect(element('#pageHeader-alert').html()).toBeDefined();
//    });
//  });

  describe('Logs Out', function() {
    it('Logs out', function() {
      e2eLogOut();
    });
  });
});
