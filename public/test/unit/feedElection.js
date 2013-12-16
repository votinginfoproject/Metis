/**
 * Created by rcartier13 on 12/13/13.
 */

describe('Feed Election Unit Tests', function() {

  describe('Feed Election Controller Test', function() {
    var $rootScope = null;
    var $httpBackend = null;
    var feedCtrl = null;
    var mockService;
    var myResponse;

    beforeEach(inject(function($injector) {
      mockService = {
        getFeedData: function() {
          var http = $injector.get('$http');
          return http.get("/Data");
        },
        getFeedElection: function() {
          var http = $injector.get('$http');
          return http.get("/Election")
        },
        getFeedState: function() {
          var http = $injector.get('$http');
          return http.get("/FeedState")
        },
        getFeedElectionContests: function() {
          var http = $injector.get('$http');
          return http.get("/Contests")
        }
      }

      $httpBackend = $injector.get('$httpBackend');
      myResponse = ["date: '2011-11-01, state: 'Ohio', type: 'Federal', status: 'Undetermined'"];

      $httpBackend.when('GET', '/Data').respond(myResponse);
      $httpBackend.when('GET', '/Election').respond(myResponse);
      $httpBackend.when('GET', '/Contests').respond(myResponse);
      $httpBackend.when('GET', '/FeedState').respond(myResponse);

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

      $rootScope.setPageHeader = function(a,b,c,d) {
        return;
      }

      feedCtrl = $controller('FeedElectionCtrl', {
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
    });

    it('should have valid data', function() {
      expect($rootScope.feedElection.date).toEqual("2013/12/21");
      expect($rootScope.feedState.id).toEqual(123);
      expect($rootScope.feedElectionContests[0].id).toEqual(600001);
      $httpBackend.flush();
    });
  });
});