/**
 * Created by rcartier13 on 1/17/14.
 */

describe('Feed Precinct Unit Tests', function() {

  describe('Feed Precinct Controller Test', function() {
    var $rootScope = null;
    var $httpBackend = null;
    var feedData;

    beforeEach(inject(function($injector) {
      var mockService = {
        getFeedData: karmaUtil.setupServiceFunc($injector),
        getFeedPrecinct: karmaUtil.setupServiceFunc($injector),
        getFeedPrecinctEarlyVoteSites: karmaUtil.setupServiceFunc($injector),
        getFeedPrecinctElectoralDistricts: karmaUtil.setupServiceFunc($injector),
        getFeedPrecinctPollingLocations: karmaUtil.setupServiceFunc($injector),
        getFeedPrecinctPrecinctSplits: karmaUtil.setupServiceFunc($injector)
      }

      $httpBackend = $injector.get('$httpBackend');
      feedData = [ {date: '2011-11-01', state: 'Ohio', type: 'Federal', status: 'Undetermined'} ];
      $rootScope = $injector.get('$rootScope');
      karmaUtil.setupControllerTest($injector, feedData, $httpBackend, $rootScope, 'FeedPrecinctCtrl', mockService);
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should have valid data', function() {
      $httpBackend.flush();
      expect($rootScope.feedData).toEqual(feedData);
      expect($rootScope.feedPrecinct).toEqual(feedData);
      expect($rootScope.feedEarlyVoteSites).toEqual(feedData);
      expect($rootScope.feedElectoralDistricts).toEqual(feedData);
      expect($rootScope.feedPollingLocations).toEqual(feedData);
      expect($rootScope.feedPrecinctSplits).toEqual(feedData);
    });
  });
});