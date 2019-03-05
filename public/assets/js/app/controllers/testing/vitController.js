'use strict';
/*
 * VIT Staging Controller
 *
 */
function VitCtrl($scope, $rootScope, $sce, $backendService) {
  var breadcrumbs = null;
  // initialize page header variables
  $rootScope.setPageHeader("VIT Staging Tool", breadcrumbs, "testing", "", null);

  var getApiKey = function () {
    $backendService.getResponse (
      {path: "/config/vit",
       scope: $scope,
       key: "apiKey",
       config: {}},
      function (results) {
        //have to use the trustAsResourceUrl to get it to accept
        //injecting a value into a href/src field
        $rootScope.vitUrl =
          $sce.trustAsResourceUrl("/vit.html?apiKey=" + results);
      });
  };
 getApiKey();
};
