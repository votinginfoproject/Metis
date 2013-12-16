/**
 * Created by rcartier13 on 12/13/13.
 */

describe('Feed Overview Unit Tests', function() {

  describe('Feed Overview Controller Test', function () {
    var $rootScope = null;
    var $httpBackend = null;
    var adminCtrl = null;
    var mockService;

    beforeEach(inject(function($injector) {
      mockService = {
        getFeedData: function() {
          var http = $injector.get('$http');
          return http.get("/Data");
        },
        getFeedSource: function() {
          var http = $injector.get('$http');
          return http.get("/Source");
        },
        getFeedContact: function() {
          var http = $injector.get('$http');
          return http.get("/Contact");
        }
      }

      $httpBackend = $injector.get('$httpBackend');

      $httpBackend.when('GET', '/Data').respond('');
      $httpBackend.when('GET', '/Source').respond('');
      $httpBackend.when('GET', '/Contact').respond('');


      $rootScope = $injector.get('$rootScope');
      var $controller = $injector.get('$controller');
      var $location = $injector.get('$location');

      var routeParams = { badlogin: true };

      $rootScope.setPageHeader = function(a,b,c,d) {
        return;
      }

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
      expect($rootScope.feedData.title).toEqual("Source Title");
      expect($rootScope.feedSource.name).toEqual("VA State Board of Elections");
      expect($rootScope.feedContact.name).toEqual("Steve Tyler");
      $httpBackend.flush();
    });
  });
});