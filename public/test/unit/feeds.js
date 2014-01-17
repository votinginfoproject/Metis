/**
 * Created by rcartier13 on 12/11/13.
 */

describe('Feed Unit Tests', function() {

  describe('Feed Controller Test', function() {
    var $rootScope = null;
    var $httpBackend = null;
    var feedCtrl = null;
    var mockService;
    var myResponse;

    beforeEach(inject(function($injector) {
      mockService = {
        getFeeds: function() {
          var http = $injector.get('$http');
          return http.get("/test");
        }
      }

      $httpBackend = $injector.get('$httpBackend');
      myResponse = [ {date: '2011-11-01', state: 'Ohio', type: 'Federal', status: 'Undetermined'} ];

      $httpBackend.when('GET', '/test').respond(myResponse);

      $rootScope = $injector.get('$rootScope');
      var $controller = $injector.get('$controller');
      var $location = $injector.get('$location');
      var $filter = $injector.get('$filter');
      function ngTableParams (defaults) {
        this.page = defaults.page;
        this.count = defaults.count;
        this.sorting = defaults.sorting;
      }

      $rootScope.setPageHeader = function() {};

      $rootScope.createTableParams = function() {};

      $rootScope.getBreadCrumbs = function() {};

      feedCtrl = $controller('FeedsCtrl', {
        '$scope': $rootScope,
        '$rootScope': $rootScope,
        '$feedsService': mockService,
        '$location': $location,
        '$filter': $filter,
        'ngTableParams': ngTableParams
      });
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    })

    it('should set the feeds properly', function() {
      $httpBackend.flush();
      expect($rootScope.feeds).toEqual(myResponse);
    });
  });

  describe('Feeds Service Test', function() {
    var feedsService, httpBackend;
    beforeEach(angular.mock.module('vipApp'));

    beforeEach(inject(function($feedsService, $httpBackend) {
      feedsService = $feedsService;
      httpBackend = $httpBackend;
    }));

    describe('getFeeds test', function() {
      it('should be valid', function() {
        expect(feedsService).toBeDefined();
        expect(feedsService.getFeeds).toBeDefined();
        spyOn(feedsService, 'getFeeds');
        feedsService.getFeeds();
        expect(feedsService.getFeeds).toHaveBeenCalled();
      });
    });

    describe('getFeedData test', function() {
      it('should be valid', function() {
        expect(feedsService.getFeedData).toBeDefined();
        spyOn(feedsService, 'getFeedData');
        feedsService.getFeedData();
        expect(feedsService.getFeedData).toHaveBeenCalled();
      });
    });

    describe('getFeedPollingLocations test', function() {
      it('should be valid', function() {
        expect(feedsService.getFeedPollingLocations).toBeDefined();
        spyOn(feedsService, 'getFeedPollingLocations');
        feedsService.getFeedPollingLocations();
        expect(feedsService.getFeedPollingLocations).toHaveBeenCalled();
      });
    });

    describe('getFeedContests test', function() {
      it('should be valid', function() {
        expect(feedsService.getFeedContests).toBeDefined();
        spyOn(feedsService, 'getFeedContests');
        feedsService.getFeedContests();
        expect(feedsService.getFeedContests).toHaveBeenCalled();
      });
    });

    describe('getFeedResults test', function() {
      it('should be valid', function() {
        expect(feedsService.getFeedResults).toBeDefined();
        spyOn(feedsService, 'getFeedResults');
        feedsService.getFeedResults();
        expect(feedsService.getFeedResults).toHaveBeenCalled();
      });
    });

    describe('getFeedSource test', function() {
      it('should be valid', function() {
        expect(feedsService.getFeedSource).toBeDefined();
        spyOn(feedsService, 'getFeedSource');
        feedsService.getFeedSource();
        expect(feedsService.getFeedSource).toHaveBeenCalled();
      });
    });

    describe('getFeedElection test', function() {
      it('should be valid', function() {
        expect(feedsService.getFeedElection).toBeDefined();
        spyOn(feedsService, 'getFeedElection');
        feedsService.getFeedElection();
        expect(feedsService.getFeedElection).toHaveBeenCalled();
      });
    });

    describe('getFeedElectionContests test', function() {
      it('should be valid', function() {
        expect(feedsService.getFeedElectionContests).toBeDefined();
        spyOn(feedsService, 'getFeedElectionContests');
        feedsService.getFeedElectionContests();
        expect(feedsService.getFeedElectionContests).toHaveBeenCalled();
      });
    });
  });
});