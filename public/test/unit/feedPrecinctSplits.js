/**
 * Created by rcartier13 on 1/17/14.
 */

describe('Feed Contests Unit Tests', function() {

  describe('Feed Contests Controller Test', function() {
    var $rootScope = null;
    var $httpBackend = null;
    var feedCtrl = null;
    var mockService;
    var feedData, feedLocalities;

    beforeEach(inject(function($injector) {
      mockService = {
        getFeedData: function() {
          var http = $injector.get('$http');
          return http.get("/Data");
        },
        getFeedPrecinctSplits: function() {
          var http = $injector.get('$http');
          return http.get("/PrecinctSplits")
        }
      }

      $httpBackend = $injector.get('$httpBackend');
      feedData = [ {date: '2011-11-01', state: 'Ohio', type: 'Federal', status: 'Undetermined'} ];
      $httpBackend.when('GET', '/Data').respond(feedData);
      $httpBackend.when('GET', '/PrecinctSplits').respond(feedData);

      $rootScope = $injector.get('$rootScope');
      var $controller = $injector.get('$controller');
      var $location = $injector.get('$location');
      var $filter = $injector.get('$filter');
      function ngTableParams (defaults) {
        this.page = defaults.page;
        this.count = defaults.count;
        this.sorting = defaults.sorting;
      }

      var routeParams = { vipfeed: 'something' };
      $rootScope.pageHeader = {};
      $rootScope.feedData = {};

      $rootScope.setPageHeader = function() {}
      $rootScope.createTableParams = function() {};
      $rootScope.getBreadCrumbs = function() {};
      $rootScope.getServiceUrl = function() {};

      feedCtrl = $controller('FeedPrecinctSplitsCtrl', {
        '$scope': $rootScope,
        '$rootScope': $rootScope,
        '$feedsService': mockService,
        '$routeParams': routeParams,
        ngTableParams: ngTableParams,
        '$location': $location
      });
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should have valid data', function() {
      $httpBackend.flush();
      expect($rootScope.feedData).toEqual(feedData);
      expect($rootScope.feedPrecinctSplits).toEqual(feedData);
    });
  });
});