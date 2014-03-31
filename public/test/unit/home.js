/**
 * Created by rcartier13 on 12/13/13.
 */

describe('Home Unit Tests', function() {

  describe('Home Controller Test', function () {
    var $rootScope = null;
    var $httpBackend = null;
    var adminCtrl = null;
    var mockService;

    beforeEach(inject(function($injector) {
      mockService = {
        getData: function() {
          var http = $injector.get('$http');
          return http.get("/test");
        }
      }

      $httpBackend = $injector.get('$httpBackend');

      $httpBackend.when('GET', '/test').respond('');

      $rootScope = $injector.get('$rootScope');
      var $controller = $injector.get('$controller');
      var $location = $injector.get('$location');

      var routeParams = { badlogin: true };

      $rootScope.setPageHeader = function(a,b,c,d,e) {
        return;
      }
      $rootScope.pageHeader = {};

      adminCtrl = $controller('HomeCtrl', {
        '$scope': $rootScope,
        '$rootScope': $rootScope,
        '$homeService': mockService,
        '$routeParams': routeParams
      });
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should throw an error', function () {
      expect($rootScope.pageHeader.error).toEqual('Bad Username or Password.');
    });
  });

//  describe('Home Service Test', function() {
//    var homeService, httpBackend;
//    beforeEach(angular.mock.module('vipApp'));
//
//    beforeEach(inject(function($homeService, $httpBackend) {
//      homeService = $homeService;
//      httpBackend = $httpBackend;
//    }));
//
//    it('should send valid data', function() {
//      expect(homeService).toBeDefined();
//      expect(homeService.getData).toBeDefined();
//      spyOn(homeService, 'getData');
//      homeService.getData();
//      expect(homeService.getData).toHaveBeenCalled();
//    });
//  });
});