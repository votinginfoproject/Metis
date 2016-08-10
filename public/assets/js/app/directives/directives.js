/*
 * <vip-overview-table> renders an overview table.
 * Attributes:
 * - tableData: the data for the rows
 * - tableParams: the table params from createTableParams()
 * - title: the title for the table
 * - id-prefix: a prefix for the ids generated in the table.
*/
vipApp.directive('vipOverviewTable', function () {
  return {
    restrict: 'E',
    scope: {
      tableData: '=',
      tableParams: '=',
      title: '@',
      idPrefix: '@'
    },
    templateUrl: 'app/partials/5.1/overviewTable.html',
  }
});
