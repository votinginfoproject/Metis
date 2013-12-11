/**
 * Created by rcartier13 on 12/9/13.
 */

describe('Feeds test', function () {
  // Basic test to see if the feeds are showing up
  it('Showing feeds', function () {
    browser().navigateTo(testGlobals.appRootUrl);
    e2eLogIn('testuser', 'test');
    sleep(0.2);
    expect(element('#feedsTable').count()).not().toBe(0);
    // TODO: remove when more tests are added
    e2eLogOut()
  });

//  it('Does data sort properly', function () {
//    var dates = repeater('#feedsTable-date');
//    //var greaterOrEqual = (dates.column('feed.date')[0] >= dates.column('feed.date')[1]) ? "true" : "false";
//    console.log(dates);
//    console.log(dates.column('feed.date')[0])
//    // expect(dates.column('feed.date')[0]).toBeDefined();
//    e2eLogOut()
//  });
});