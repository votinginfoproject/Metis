/**
 * Created by rcartier13 on 1/23/14.
 */

/**
 * Created by rcartier13 on 1/22/14.
 */

describe('Testing Feed Candidate Page', function() {

  describe('Log in', function () {

    // Successful attempt
    //    currently only with local client, need to modify later for crowd
    it('Accepts a proper username + password', function () {
      e2eLogIn('testuser', 'test');
    });
  });

  describe('Contest Page is able to be navigated to', function() {
    it('Navigates to Candidate', function() {
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

      element('#ballot-id a').click();
      expect(element('#feed-ballot-content').count()).toBe(1);

      element('#ballotcandidates-id0 a').click();

      // Make sure there is no error on the page
      expect(element('#pageHeader-alert')).not().toBeDefined();
      expect(element('#feed-candidate-content').count()).toBe(1);
    });
  });

  describe('Checks if errors are thrown', function() {
    it('Navigates to Candidate', function() {
      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election/contests/1contest/ballot/candidates/1candidate");
      expect(element('#pageHeader-alert').html()).toBeDefined();
    });
  });

  describe('Logs Out', function() {
    it('Logs out', function() {
      e2eLogOut();
    });
  });
});


describe('Testing Feed Candidates Page', function() {

  describe('Log in', function () {

    // Successful attempt
    //    currently only with local client, need to modify later for crowd
    it('Accepts a proper username + password', function () {
      e2eLogIn('testuser', 'test');
    });
  });

  describe('Candidates Page is able to be navigated to', function() {
    it('Navigates to Candidates', function() {
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

      element('#ballot-id a').click();
      expect(element('#feed-ballot-content').count()).toBe(1);

      element('#ballotcandidates-id0 a').click();

      element('#pageHeader-breadcrumb6').click();

      // Make sure there is no error on the page
      expect(element('#pageHeader-alert')).not().toBeDefined();
      expect(element('#feed-candidates-content').count()).toBe(1);
    });
  });

  describe('Checks if errors are thrown', function() {
    it('Navigates to Candidates', function() {
      browser().navigateTo(testGlobals.appRootUrl + "/#/feeds/vip-feed1/election/contests/1contest/ballot/candidates");
      expect(element('#pageHeader-alert').html()).toBeDefined();
    });
  });

  describe('Logs Out', function() {
    it('Logs out', function() {
      e2eLogOut();
    });
  });
});

