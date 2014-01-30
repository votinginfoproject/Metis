/**
 * Created by rcartier13 on 1/17/14.
 */

describe('Feed Precinct Split Unit Tests', function() {

  describe('Feed Precinct Split Controller Test', function() {
    var $rootScope = null;
    var $httpBackend = null;
    var feedData;

    beforeEach(inject(function($injector) {
      var mockService = {
        getFeedData: karmaUtil.setupServiceFunc($injector),
        getFeedPrecinctSplit: karmaUtil.setupServiceFunc($injector),
        getFeedPrecinctSplitElectoralDistricts: karmaUtil.setupServiceFunc($injector),
        getFeedPrecinctSplitPollingLocations: karmaUtil.setupServiceFunc($injector)
      }

      $httpBackend = $injector.get('$httpBackend');
      feedData = [ {date: '2011-11-01', state: 'Ohio', type: 'Federal', status: 'Undetermined'} ];
      $rootScope = $injector.get('$rootScope');
      karmaUtil.setupControllerTest($injector, feedData, $httpBackend, $rootScope, 'FeedPrecinctSplitCtrl', mockService);
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should have valid data', function() {
      $httpBackend.flush();
      expect($rootScope.feedData).toEqual(feedData);
      expect($rootScope.feedPrecinctSplit).toEqual(feedData);
      expect($rootScope.feedElectoralDistricts).toEqual(feedData);
      expect($rootScope.feedPollingLocations).toEqual(feedData);
    });
  });
});