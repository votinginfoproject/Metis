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
    if(isTesting)
    {
      it('Does Pagination work', function () {
        element('#feedsPage2').click();
        expect(element('#feedIndex0').count()).not().toBe(0);
        element('#feedsPage1').click();
        expect(element('#feedIndex9').count()).not().toBe(0);
      });
    };
  });

  describe('Sorting Test', function () {

    if(isTesting)
    {
      // Only works locally atm will need to fix later
      it('Data sorting by date', function () {
        expect(element('#feedsTable tbody tr:nth-child(1) td:nth-child(1)').text()).toBe('2011-07-10');
        element('#feedsTable th:nth-child(1)').click();
        expect(element('#feedsTable tbody tr:nth-child(1) td:nth-child(1)').text()).toBe('2013-12-16');
      });

      it('Data sorting by state', function () {
        element('#feedsTable th:nth-child(2)').click();
        expect(element('#feedsTable tbody tr:nth-child(1) td:nth-child(2)').text()).toBe('West Virginia');
        element('#feedsTable th:nth-child(2)').click();
        expect(element('#feedsTable tbody tr:nth-child(1) td:nth-child(2)').text()).toBe('California');
      });

      it('Data sorting by type', function () {
        element('#feedsTable th:nth-child(3)').click();
        expect(element('#feedsTable tbody tr:nth-child(1) td:nth-child(3)').text()).toBe('State');
        element('#feedsTable th:nth-child(3)').click();
        expect(element('#feedsTable tbody tr:nth-child(1) td:nth-child(3)').text()).toBe('Federal');
      });

      it('Data sorting by status', function () {
        element('#feedsTable th:nth-child(4)').click();
        expect(element('#feedsTable tbody tr:nth-child(1) td:nth-child(4)').text()).toBe('Undetermined');
        element('#feedsTable th:nth-child(4)').click();
        expect(element('#feedsTable tbody tr:nth-child(1) td:nth-child(4)').text()).toBe('determined');
      });
    }
  });

  describe('Logging Out', function () {
    it('Logs out', function () {
      e2eLogOut();
    });
  });
});