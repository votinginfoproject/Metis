'use strict';
/*
 * Feeds Controller
 *
 */
function FeedsCtrl($scope, $rootScope, $feedsService) {

  // initialize page header variables
  $rootScope.setPageHeader("Feeds", "Feeds /", "feeds", null);

  // call our service
  $feedsService.getData()
    .success(function (data) {

      $scope.feeds = [
        {
          date: '2014/11/04',
          state: 'OH',
          type: 'General1',
          status: 'Revisions Needed',
          edit: 'vipfeed-37-2014-11-04'
        },
        {
          date: '2014/11/05',
          state: 'OH',
          type: 'General2',
          status: 'Revisions Needed',
          edit: 'vipfeed-37-2014-11-05'
        },
        {
          date: '2014/11/06',
          state: 'OH',
          type: 'General3',
          status: 'Revisions Needed',
          edit: 'vipfeed-37-2014-11-06'
        },
        {
          date: '2014/11/07',
          state: 'OH',
          type: 'General4',
          status: 'Revisions Needed',
          edit: 'vipfeed-37-2014-11-07'
        },
        {
          date: '2014/11/08',
          state: 'OH',
          type: 'General5',
          status: 'Revisions Needed',
          edit: 'vipfeed-37-2014-11-08'
        }
      ];

    }).error(function (data) {

      $rootScope.pageHeader.error = "Could not retrieve Feeds Data."
    });
}
