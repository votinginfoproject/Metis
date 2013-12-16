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
        getFeedPollingLocations: function() {
          var http = $injector.get('$http');
          return http.get("/Locations");
        },
        getFeedContests: function() {
          var http = $injector.get('$http');
          return http.get("/Contests");
        },
        getFeedResults: function() {
          var http = $injector.get('$http');
          return http.get("/Results");
        }
      }

      $httpBackend = $injector.get('$httpBackend');

      $httpBackend.when('GET', '/Data').respond('');
      $httpBackend.when('GET', '/Locations').respond('');
      $httpBackend.when('GET', '/Contests').respond('');
      $httpBackend.when('GET', '/Results').respond('');


      $rootScope = $injector.get('$rootScope');
      var $controller = $injector.get('$controller');
      var $location = $injector.get('$location');

      var routeParams = { badlogin: true };

      $rootScope.setPageHeader = function(a,b,c,d) {
        return;
      }

      $rootScope.pageHeader = {};

      adminCtrl = $controller('FeedOverviewCtrl', {
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

    it('should have valid data', function () {
      expect($rootScope.feedData.feedTitle).toEqual("Feed Overview Title");
      expect($rootScope.feedPollingLocations[0].elementType).toEqual("Random Polling Locations Element Type 1");
      expect($rootScope.feedContests[0].elementType).toEqual("Random Contests Element Type 1");
      expect($rootScope.feedResults[0].elementType).toEqual("Random Results Element Type 1");
      $httpBackend.flush();
    });
  });
});