/**
 * Created by rcartier13 on 1/30/14.
 */

var karmaUtil = {

  setupControllerTest: function($injector, feedData, $httpBackend, $rootScope, controller, mockService) {
    $httpBackend.when('GET', '/Data').respond(feedData);

    var $controller = $injector.get('$controller');
    var $location = $injector.get('$location');
    var $filter = $injector.get('$filter');
    var $appProperties = {highPagination: 30, lowPagination: 10};

    function ngTableParams (defaults) {
      this.page = defaults.page;
      this.count = defaults.count;
      this.sorting = defaults.sorting;
    }

    var routeParams = { vipfeed: 'something' };
    $rootScope.pageHeader = {};

    vipApp_ns.generateMap = function() {};

    $rootScope.setPageHeader = function() {}
    $rootScope.createTableParams = function() {};
    $rootScope.getBreadCrumbs = function() {};
    $rootScope.getServiceUrl = function() {};
    $rootScope.changeSelfToAngularPath = function() {};
    $rootScope.generatePageId = function() {};
    $rootScope.getAngularUrl = function() {};

    $controller(controller, {
      '$scope': $rootScope,
      '$rootScope': $rootScope,
      '$feedsService': mockService,
      '$routeParams': routeParams,
      '$appProperties': $appProperties,
      ngTableParams: ngTableParams,
      '$location': $location
    });
  },

  setupServiceFunc: function($injector) {
    return function() {
      var http = $injector.get('$http');
      return http.get("/Data");
    };
  }
}