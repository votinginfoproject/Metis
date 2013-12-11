/**
 * Created by rcartier13 on 12/9/13.
 */

describe('Feeds test', function () {
  // Basic test to see if the feeds are showing up
  it('Showing feeds', function () {
    e2eLoadPage();
    e2eLogIn('testuser', 'test');
    expect(element('#feedsTable').count()).not().toBe(0);
  });

  it('Does Pagination work', function () {
    if( element('#feedsPage2') ) {
      element('#feedsPage2').click();
      expect(element('#feedIndex0').count()).not().toBe(0);
      element('#feedsPage1').click();
      expect(element('#feedIndex9').count()).not().toBe(0);
    }
  });

  it('Does data sort properly by date', function () {

    var Index0 = e2eValueofRepeater('#feedIndex0', 'feed.date');
    var Index1 = e2eValueofRepeater('#feedIndex1', 'feed.date');

    // HAX! TODO: fix if possible
    if(Index0 >= Index1)
      expect(element('#feedsTable').count()).toBe(1);
    else
      expect(element('#feedsTable').count()).toBe(0);

    element('.sort-asc').click();

    var Index0 = e2eValueofRepeater('#feedIndex0', 'feed.date');
    var Index1 = e2eValueofRepeater('#feedIndex1', 'feed.date');

    // HAX! TODO: fix if possible
    if(Index0 <= Index1)
      expect(element('#feedsTable').count()).toBe(1);
    else
      expect(element('#feedsTable').count()).toBe(0);
    e2eLogOut();
  });

//  it('Does data sort properly by state', function () {
//
//
//    var Index0 = e2eValueofRepeater('#feedIndex0', 'feed.date');
//    var Index1 = e2eValueofRepeater('#feedIndex1', 'feed.date');
//
//    // HAX! TODO: fix if possible
//    if(Index0 >= Index1)
//      expect(element('#feedsTable').count()).toBe(1);
//    else
//      expect(element('#feedsTable').count()).toBe(0);
//
//    element('.sort-asc').click();
//
//    var Index0 = e2eValueofRepeater('#feedIndex0', 'feed.date');
//    var Index1 = e2eValueofRepeater('#feedIndex1', 'feed.date');
//
//    // HAX! TODO: fix if possible
//    if(Index0 <= Index1)
//      expect(element('#feedsTable').count()).toBe(1);
//    else
//      expect(element('#feedsTable').count()).toBe(0);
//
//    e2eLogOut();
//  });

});