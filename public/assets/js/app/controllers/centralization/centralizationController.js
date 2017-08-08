'use strict';
/*
 * Data Centralization Controller
 *
 */
function CentralizationCtrl($scope, $rootScope, Upload, $configService, $route) {
  var breadcrumbs = null;
  // initialize page header variables
  $scope.setPageHeader("VIP County Data Centralization Upload", breadcrumbs, "testing", "", null);

  $scope.pageHeader.title = 'VIP County Data Centralization Upload';
  $scope.upload = function (file) {
        Upload.upload({
            url: '/testing/upload',
            data: {file: file,
                   'username': $scope.username,
                   'fipsCode': $rootScope.user.fipsCodes[0]}
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            $rootScope.showUploaded = true;
            $route.reload();
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };

    $configService.getResponse({path: '/testing/latest-results-file', config: {params: {'fipsCode': $rootScope.user.fipsCodes[0]}}},
                               function(result) { $scope.latestResultsFileUrl = result; });
};
