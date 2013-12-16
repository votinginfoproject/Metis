/**
 * Created by rcartier13 on 12/13/13.
 */

describe('Profile Unit Tests', function() {

  describe('Profile Controller Test', function() {
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

      adminCtrl = $controller('ProfileCtrl', {
        '$scope': $rootScope,
        '$rootScope': $rootScope,
        '$profileService': mockService,
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
});