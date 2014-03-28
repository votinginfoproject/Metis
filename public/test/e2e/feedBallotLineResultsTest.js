/**
 * Created by rcartier13 on 1/30/14.
 */

describe('Testing Feed Ballot Line Results Page', function() {

  describe('Log in', function () {

    // Successful attempt
    //    currently only with local client, need to modify later for crowd
    it('Accepts a proper username + password', function () {
      e2eLogIn('testuser', 'test');
    });
  });

  describe('Ballot Line Results Page is able to be navigated to', function() {
    it('Navigates to Contest', function() {
      // expect to start out on the feed index page
      // click the first feed
      element('#date0 a').click();
      sleep(testGlobals.sleepTime);

      // should have an election link
      expect(element('#election-link').count()).toBe(1);

      // click the election link
      element('#election-link').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed election page
      expect(element('#feed-election-content').count()).toBe(1);

      element('#contests-id0 a').click();

      expect(element('#feed-contest-content').count()).toBe(1);

      element('#ballotlineresult-id0 a').click();
      expect(element('#feed-ballotlineresult-content').count()).toBe(1);

      element('#pageHeader-breadcrumb5 a').click();

      expect(element('#pageHeader-alert')).not().toBeDefined();
      expect(element('#feed-ballotlineresults-content').count()).toBe(1);
      expect(element('#result-id0').count()).toBe(1);
    });
  });

  describe('Checks if errors were thrown', function() {
    it('Navigates to Ballot', function() {
      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election/contests/1contest/ballotlineresults");
      expect(element('#pageHeader-alert').html()).toBeDefined();
    });
  });

  describe('Logs Out', function() {
    it('Logs out', function() {
      e2eLogOut();
    });
  });
});