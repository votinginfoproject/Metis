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

	$scope.states =
	[{fipsCode: "", state: "All"},
	 {fipsCode: "01",  state: "Alabama" },
	 {fipsCode: "02",  state: "Alaska" },
	 {fipsCode: "04",  state: "Arizona" },
	 {fipsCode: "05",  state: "Arkansas" },
	 {fipsCode: "06",  state: "California" },
	 {fipsCode: "08",  state: "Colorado" },
	 {fipsCode: "09",  state: "Connecticut" },
	 {fipsCode: "10",  state: "Delaware" },
	 {fipsCode: "11",  state: "District of Columbia" },
	 {fipsCode: "12",  state: "Florida" },
	 {fipsCode: "13",  state: "Georgia" },
	 {fipsCode: "15",  state: "Hawaii" },
	 {fipsCode: "16",  state: "Idaho" },
	 {fipsCode: "17",  state: "Illinois" },
	 {fipsCode: "18",  state: "Indiana" },
	 {fipsCode: "19",  state: "Iowa" },
	 {fipsCode: "20",  state: "Kansas" },
	 {fipsCode: "21",  state: "Kentucky" },
	 {fipsCode: "22",  state: "Louisiana" },
	 {fipsCode: "23",  state: "Maine" },
	 {fipsCode: "24",  state: "Maryland" },
	 {fipsCode: "25",  state: "Massachusetts" },
	 {fipsCode: "26",  state: "Michigan" },
	 {fipsCode: "27",  state: "Minnesota" },
	 {fipsCode: "28",  state: "Mississippi" },
	 {fipsCode: "29",  state: "Missouri" },
	 {fipsCode: "30",  state: "Montana" },
	 {fipsCode: "31",  state: "Nebraska" },
	 {fipsCode: "32",  state: "Nevada" },
	 {fipsCode: "33",  state: "New Hampshire" },
	 {fipsCode: "34",  state: "New Jersey" },
	 {fipsCode: "35",  state: "New Mexico" },
	 {fipsCode: "36",  state: "New York" },
	 {fipsCode: "37",  state: "North Carolina" },
	 {fipsCode: "38",  state: "North Dakota" },
	 {fipsCode: "39",  state: "Ohio" },
	 {fipsCode: "40",  state: "Oklahoma" },
	 {fipsCode: "41",  state: "Oregon" },
	 {fipsCode: "42",  state: "Pennsylvania" },
	 {fipsCode: "44",  state: "Rhode Island" },
	 {fipsCode: "45",  state: "South Carolina" },
	 {fipsCode: "46",  state: "South Dakota" },
	 {fipsCode: "47",  state: "Tennessee" },
	 {fipsCode: "48",  state: "Texas" },
	 {fipsCode: "49",  state: "Utah" },
	 {fipsCode: "50",  state: "Vermont" },
	 {fipsCode: "51",  state: "Virginia" },
	 {fipsCode: "53",  state: "Washington" },
	 {fipsCode: "54",  state: "West Virginia" },
	 {fipsCode: "55",  state: "Wisconsin" },
	 {fipsCode: "56",  state: "Wyoming" }];

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
               'date': $scope.date}
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

	$scope.getFiles = function(selectedState) {
		var cfg = {};
		if (selectedState) {
			cfg = {params: {prefix: selectedState.fipsCode}};
		}
    $configService.getResponse({path: '/centralization/submitted-files', config: cfg},
                               function(result) { $scope.submittedFiles = result; });
	}

  if ($rootScope.user) {
		$scope.getFiles();
  }
};
