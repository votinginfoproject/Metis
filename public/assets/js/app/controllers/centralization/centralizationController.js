'use strict';
/*
 * Data Centralization Controller
 *
 */
function CentralizationCtrl($scope, $rootScope, Upload, $configService, $route, $authService, $location) {

  if (!$authService.isAuthenticated()) {
    $location.url('/');
  }

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

  $rootScope.getStateFromFips = function(fipsCode) {
    var codes = {
      "01": "Alabama",
      "05": "Arkansas",
      "06": "California",
      "08": "Colorado",
      "09": "Connecticut",
      "10": "Delaware",
      "11": "District of Columbia",
      "12": "Florida",
      "13": "Georgia",
      "15": "Hawaii",
      "16": "Idaho",
      "17": "Illinois",
      "18": "Indiana",
      "19": "Iowa",
      "20": "Kansas",
      "21": "Kentucky",
      "22": "Louisiana",
      "23": "Maine",
      "24": "Maryland",
      "25": "Massachusetts",
      "26": "Michigan",
      "27": "Minnesota",
      "28": "Mississippi",
      "29": "Missouri",
      "30": "Montana",
      "31": "Nebraska",
      "32": "Nevada",
      "33": "New Hampshire",
      "34": "New Jersey",
      "35": "New Mexico",
      "36": "New York",
      "37": "North Carolina",
      "38": "North Dakota",
      "39": "Ohio",
      "40": "Oklahoma",
      "41": "Oregon",
      "42": "Pennsylvania",
      "44": "Rhode Island",
      "45": "South Carolina",
      "46": "South Dakota",
      "47": "Tennessee",
      "48": "Texas",
      "49": "Utah",
      "50": "Vermont",
      "51": "Virginia",
      "53": "Washington",
      "54": "West Virginia",
      "55": "Wisconsin",
      "56": "Wyoming"
    }
    return codes[fipsCode];
  }

  $configService.getResponse({path: '/centralization/submitted-files', config: {params: {'fipsCode': $rootScope.user.fipsCodes[0], 'roles': $rootScope.user.roles}}},
                             function(result) { $scope.submittedFiles = result; });
};
