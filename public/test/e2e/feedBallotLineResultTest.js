/**
 * Created by rcartier13 on 1/30/14.
 */

describe('Testing Feed Ballot Line Result Page', function() {

  describe('Log in', function () {

    // Successful attempt
    //    currently only with local client, need to modify later for crowd
    it('Accepts a proper username + password', function () {
      e2eLogIn('testuser', 'test');
    });
  });

  describe('Ballot Line Result Page is able to be navigated to', function() {
    xit('Navigates to Contest', function() {
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

      expect(element('#sidebar-contests').count()).toBe(1);

      // click the contests link
      element('#sidebar-contests').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed election page
      expect(element('#feed-contests-content').count()).toBe(1);

      element('#contests-id0 a').click();

      expect(element('#feed-contest-content').count()).toBe(1);

      element('#ballotlineresult-id0 a').click();

      expect(element('#pageHeader-alert')).not().toBeDefined();
      expect(element('#feed-ballotlineresult-content').count()).toBe(1);
    });

    xit('Has content on the page', function() {
      expect(element('#ballotlineresult-votes').count()).toBe(1);
      expect(element('#contest-id').count()).toBe(1);
      expect(element('#jurisdiction-id').count()).toBe(1);
      expect(element('#candidate-id').count()).toBe(1);
    });

    xit('Contest Page link works', function() {
      element('#contest-id a').click();
      expect(element('#feed-contest-content').count()).toBe(1);
    });

    xit('Jurisdiction Link works', function() {
      element('#ballotlineresult-id0 a').click();
      expect(element('#feed-ballotlineresult-content').count()).toBe(1);
      element('#jurisdiction-id a').click();
      expect(element('#feeds-election-contests-electoraldistrict-content-single').count()).toBe(1);
    });

    xit('Candidate Link works', function() {
      element('#pageHeader-breadcrumb3 a').click();
      expect(element('#feed-contest-content').count()).toBe(1);
      element('#ballotlineresult-id0 a').click();
      expect(element('#feed-ballotlineresult-content').count()).toBe(1);
      element('#candidate-id a').click();
      expect(element('#feed-candidate-content').count()).toBe(1);
    });
  });

//  describe('Checks if errors were thrown', function() {
//    it('Navigates to Ballot', function() {
//      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election/contests/1contest/ballotlineresults/1ballotlineresult");
//      expect(element('#pageHeader-alert').html()).toBeDefined();
//    });
//  });

  describe('Logs Out', function() {
    it('Logs out', function() {
      e2eLogOut();
    });
  });
});
