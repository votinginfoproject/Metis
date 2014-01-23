/**
 * Created by rcartier13 on 1/23/14.
 */


describe('Feed Candidate Unit Tests', function() {

  describe('Feed Candidate Controller Test', function() {
    var $rootScope = null;
    var $httpBackend = null;
    var feedCtrl = null;
    var mockService;
    var feedData;

    beforeEach(inject(function($injector) {
      mockService = {
        getFeedData: function() {
          var http = $injector.get('$http');
          return http.get("/Data");
        },
        getFeedCandidate: function() {
          var http = $injector.get('$http');
          return http.get("/Candidate")
        }
      }

      $httpBackend = $injector.get('$httpBackend');
      feedData = [ {date: '2011-11-01', state: 'Ohio', type: 'Federal', status: 'Undetermined'} ];
      $httpBackend.when('GET', '/Data').respond(feedData);
      $httpBackend.when('GET', '/Candidate').respond(feedData);

      $rootScope = $injector.get('$rootScope');
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
      $rootScope.feedData = {};
      $rootScope.feedElection = {};
      $rootScope.feedContests = {};

      $rootScope.setPageHeader = function() {}
      $rootScope.createTableParams = function() {};
      $rootScope.getBreadCrumbs = function() {};
      $rootScope.getServiceUrl = function() {};

      feedCtrl = $controller('FeedCandidateCtrl', {
        '$scope': $rootScope,
        '$rootScope': $rootScope,
        '$feedsService': mockService,
        '$routeParams': routeParams,
        '$appProperties': $appProperties,
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
      expect($rootScope.feedCandidate).toEqual(feedData);

    });
  });
});