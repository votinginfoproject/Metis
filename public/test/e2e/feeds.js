/**
 * Created by rcartier13 on 12/9/13.
 */

describe('Feeds test', function () {
  // Basic test to see if the feeds are showing up
  it('Showing feeds', function () {
    browser().navigateTo('http://localhost:4000');
    e2eLogIn('testuser', 'test');
    sleep(0.2);
    expect(element('#feedsTable-date').count()).not().toBe(0);
    e2eLogOut();
  });

});