'use strict';
/*
 * Data Centralization Controller
 *
 */
function CentralizationCtrl($scope, $rootScope, Upload, $configService, $route) {
  var breadcrumbs = null;
  // initialize page header variables
  $scope.setPageHeader("VIP County Data Centralization Upload", breadcrumbs, "centralization", "", null);

  $scope.cannotSubmit = function() {
    $scope.date = getDateValue();
    if ($scope.file && $scope.date) {
      return false;
    } else {
      return true;
    }
  };

  $scope.submit = function() {
    // check that we have a date and a file
    if(!$scope.cannotSubmit()) {
      $scope.upload($scope.form);
    } else {
      missingValue("both an election date and file are required for uploading");
    }
  };
  $scope.upload = function (form) {
    $scope.date = getDateValue().split("/").join("-");
    console.log($scope.date);
    Upload.upload({
        url: '/centralization/upload',
        data: {file: $scope.file,
               'date': $scope.date,
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
};
