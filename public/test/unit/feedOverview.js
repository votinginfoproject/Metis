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

      response = [ {date: '2011-11-01', state: 'Ohio', type: 'Federal', status: 'Undetermined'} ];

      $httpBackend.when('GET', '/Data').respond(response);
      $httpBackend.when('GET', '/Locations').respond(response);
      $httpBackend.when('GET', '/Contests').respond(response);
      $httpBackend.when('GET', '/Results').respond(response);


      $rootScope = $injector.get('$rootScope');
      var $controller = $injector.get('$controller');
      var $location = $injector.get('$location');

      var routeParams = { badlogin: true };

      $rootScope.setPageHeader = function(a,b,c,d) {
        return;
      }

      $rootScope.feedData = {};
      $rootScope.feedPollingLocations = {};
      $rootScope.feedContests = {};
      $rootScope.feedResults = {};
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
      $httpBackend.flush();
      expect($rootScope.feedData).toEqual(response);
      expect($rootScope.feedPollingLocations).toEqual(response);
      expect($rootScope.feedContests).toEqual(response);
      expect($rootScope.feedResults).toEqual(response);
    });
  });
});