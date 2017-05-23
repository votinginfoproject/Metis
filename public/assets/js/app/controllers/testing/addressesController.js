'use strict';
/*
 * Batch Addresses Controller
 *
 */
function AddressesCtrl($scope, $rootScope, Upload) {
  var breadcrumbs = null;
  // initialize page header variables
  $rootScope.setPageHeader("Batch Check Test Addresses", breadcrumbs, "testing", "", null);

  $scope.upload = function (file) {
        Upload.upload({
            url: '/testing/upload',
            data: {file: file, 'username': $scope.username}
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };


};
