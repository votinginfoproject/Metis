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
    // the ui-date that is allowing the user to select their date via a calendar
    // is not fully compatible with angular 1.2.1, so this calls to a function
    // defined in public/index.html to get the value from the date picker
    // since it can't bind properly to an ng-model
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
  $configService.getResponse({path: '/centralization/submitted-files', config: {params: {'fipsCode': $rootScope.user.fipsCodes[0]}}},
                             function(result) { $scope.submittedFiles = result; });
};
