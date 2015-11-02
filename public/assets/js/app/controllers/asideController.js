function AsideCtrl($scope, $rootScope, $http, $feedDataPaths, $routeParams) {
  var feedid = $routeParams.vipfeed;

  function sendEmail(election) {
    $http.post('/notifications/approve-feed', {
      ":public-id": feedid,
      adminEmail: true,
      election: election,
      user: $scope.$parent.user
    }).then(function() { console.log('Notification has been sent.') },
            function() { console.log('Notification encountered a problem.') });
  }

  $rootScope.notifyApproveFeed = function() {
    if(confirm("By approving this feed, you are releasing the data for this election for publication. Do you want to approve this feed?")) {
      $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/election',
                                   scope: $rootScope,
                                   key: "election",
                                   errorMessage: "Could not send the approve feed email."},
                                 function(result) {
                                   sendEmail(result[0]);
                                 });
    };
  };

  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/election',
                               scope: $rootScope,
                               key: "election",
                               errorMessage: "Could not retrieve Election."},
                             function(result) { $rootScope.election = result[0]; });

  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/error-total-count',
                               scope: $rootScope,
                               key: "errorCount",
                               errorMessage: "Could not retrieve Feed Error Count."},
                             function(result) { $rootScope.errorCount = result[0]; });

  $feedDataPaths.getResponse({ path: '/db/feeds/' + feedid + '/approvable-status',
                               scope: $rootScope,
                               key: 'feedIsApprovable',
                               errorMessage: 'Could not determine if the feed can be approved.'},
                             function(result) {
                               $rootScope.feedIsApprovable = !result[0]['not_approvable'];
                               $rootScope.feedIsApproved   = !!result[0]['approved_result_id'];
                             })
}
