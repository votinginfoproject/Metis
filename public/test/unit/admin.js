/**
 * Created by rcartier13 on 12/12/13.
 */

describe('Admin Unit Tests', function() {

  describe('Admin Controller Test', function() {
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
      var myRespose = "userX";

      $httpBackend.when('GET', '/test').respond(myRespose);

      $rootScope = $injector.get('$rootScope');
      var $controller = $injector.get('$controller');
      var $location = $injector.get('$location');

      $rootScope.setPageHeader = function(a,b,c,d) {
        return;
      }

      adminCtrl = $controller('AdminCtrl', {
        '$scope': $rootScope,
        '$rootScope': $rootScope,
        '$adminService': mockService,
        '$location': $location
      });
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    })

    it('should data should equal userX', function () {
      $httpBackend.flush();
      expect($rootScope.data).toEqual('userX');
    });
  });

  describe('Admin Service Test', function() {
    var adminService, httpBackend;
    beforeEach(angular.mock.module('vipApp'));

    beforeEach(inject(function($adminService, $httpBackend) {
      adminService = $adminService;
      httpBackend = $httpBackend;
    }));

    describe('getData tests', function() {
      it('should be valid', function() {
        expect(adminService).toBeDefined();
        expect(adminService.getData).toBeDefined();
        spyOn(adminService, 'getData');
        adminService.getData();
        expect(adminService.getData).toHaveBeenCalled();
      });
    });
  });
});