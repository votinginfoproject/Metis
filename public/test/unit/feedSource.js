/**
 * Created by rcartier13 on 12/13/13.
 */

describe('Feed Overview Unit Tests', function() {

  describe('Feed Overview Controller Test', function () {
    var $rootScope = null;
    var $httpBackend = null;
    var adminCtrl = null;
    var mockService;
    var response;
    beforeEach(inject(function($injector) {
      mockService = {
        getFeedData: function() {
          var http = $injector.get('$http');
          return http.get("/Data");
        },
        getFeedSource: function() {
          var http = $injector.get('$http');
          return http.get("/Source");
        }
      }

      $httpBackend = $injector.get('$httpBackend');

      response = [ {date: '2011-11-01', state: 'Ohio', type: 'Federal', status: 'Undetermined'} ];

      $httpBackend.when('GET', '/Data').respond(response);
      $httpBackend.when('GET', '/Source').respond(response);


      $rootScope = $injector.get('$rootScope');
      var $controller = $injector.get('$controller');
      var $location = $injector.get('$location');

      var routeParams = { badlogin: true };

      $rootScope.setPageHeader = function() {};

      $rootScope.createTableParams = function() {};

      $rootScope.getBreadCrumbs = function() {};

      $rootScope.pageHeader = {};

      adminCtrl = $controller('FeedSourceCtrl', {
        '$scope': $rootScope,
        '$rootScope': $rootScope,
        '$feedsService': mockService,
        '$routeParams': routeParams,
        '$location': $location
      });
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    })

    it('should throw an error', function () {
      $httpBackend.flush();
      expect($rootScope.feedData).toEqual(response);
      expect($rootScope.feedSource).toEqual(response);
    });
  });
});