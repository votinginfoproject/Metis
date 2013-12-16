/**
 * Created by rcartier13 on 12/9/13.
 */

describe('Feeds test', function () {
  // Basic test to see if the feeds are showing up
  describe('Logging In', function () {
    it('Showing feeds', function () {
      e2eLoadPage(testGlobals.appRootUrl);
      e2eLogIn('testuser', 'test');
      expect(element('#feedsTable').count()).not().toBe(0);
    });
  });

  describe('Pagination Test', function () {
    it('Does Pagination work', function () {
      if (element('#feedsPage2')) {
        element('#feedsPage2').click();
        expect(element('#feedIndex0').count()).not().toBe(0);
        element('#feedsPage1').click();
        expect(element('#feedIndex9').count()).not().toBe(0);
      }
    });
  });

  describe('Sorting Test', function () {
    // Only works locally atm will need to fix later
    xit('Data sorting by date', function () {
      expect(element('#feedsTable tbody tr:nth-child(1) td:nth-child(1)').text()).toBe('2012-11-01');
      element('#feedsTable th:nth-child(1)').click();
      expect(element('#feedsTable tbody tr:nth-child(1) td:nth-child(1)').text()).toBe('2012-11-11');
    });

    xit('Data sorting by state', function () {
      element('#feedsTable th:nth-child(2)').click();
      expect(element('#feedsTable tbody tr:nth-child(1) td:nth-child(2)').text()).toBe('Texas');
      element('#feedsTable th:nth-child(2)').click();
      expect(element('#feedsTable tbody tr:nth-child(1) td:nth-child(2)').text()).toBe('California');
    });

    xit('Data sorting by type', function () {
      element('#feedsTable th:nth-child(3)').click();
      expect(element('#feedsTable tbody tr:nth-child(1) td:nth-child(3)').text()).toBe('State');
      element('#feedsTable th:nth-child(3)').click();
      expect(element('#feedsTable tbody tr:nth-child(1) td:nth-child(3)').text()).toBe('Federal');
    });

    xit('Data sorting by status', function () {
      element('#feedsTable th:nth-child(4)').click();
      expect(element('#feedsTable tbody tr:nth-child(1) td:nth-child(4)').text()).toBe('Undetermined');
      element('#feedsTable th:nth-child(4)').click();
      expect(element('#feedsTable tbody tr:nth-child(1) td:nth-child(4)').text()).toBe('determined');
    });
  });

  describe('Logging Out', function () {
    it('Logs out', function () {
      e2eLogOut();
    });
  });
});