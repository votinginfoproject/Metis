'use strict';
/*
 * Feeds Controller
 *
 */
function FeedsCtrl($scope, $rootScope, $feedDataPaths, $feedsService, $location, $filter, ngTableParams, $interval, $timeout, $route, Upload) {
  $scope.upload = function(file) {
    Upload.upload({
    url: 'https://khall-test.s3.amazonaws.com/', //S3 upload url including bucket name
    method: 'POST',
    data: {
        key: file.name, // the key to store the file on S3, could be file name or customized
        AWSAccessKeyId: "",
        acl: 'private', // sets the access to the uploaded file in the bucket: private, public-read, ...
        policy: '',
        signature: '', // base64-encoded signature based on policy string (see article below)
        "Content-Type": file.type != '' ? file.type : 'application/octet-stream', // content type of the file (NotEmpty)
        // filename: file.name, // this is needed for Flash polyfill IE8-9
        file: file
        }
  });
};
  // initialize page header variables
  $rootScope.setPageHeader("Feeds", $rootScope.getBreadCrumbs(), "feeds", null);

  $rootScope.page = 0;

  var getFeedResponse = function() {
    $feedDataPaths.getResponse(
      {path: "/db/feeds",
       config: {'params': {'page': $rootScope.page}},
       scope: $rootScope,
       key: "feeds",
       errorMessage: "Could not retrieve Feeds."},
      function(result) {
        for (var i = 0; i < result.length; i++) {
          var feed = $rootScope.feeds[i];
          var date = new Date(feed.election_date);
          $rootScope.feeds[i]['due_on'] = date.setDate(date.getDate() - 22);
        }});
  };

  $rootScope.nextPage = function() {
    $rootScope.page = $rootScope.page + 1;

    getFeedResponse();
  };

  $rootScope.previousPage = function() {
    if ($rootScope.page > 0) {
      $rootScope.page = $rootScope.page - 1;
      getFeedResponse();
    }
  };

  getFeedResponse();
}
