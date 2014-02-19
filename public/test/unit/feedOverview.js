/**
 * Created by rcartier13 on 12/13/13.
 */

describe('Feed Overview Unit Tests', function() {

  describe('Feed Overview Controller Test', function () {
    var $rootScope = null;
    var $httpBackend = null;
    var feedData;

    beforeEach(inject(function($injector) {
      var mockService = {
        getFeedData: karmaUtil.setupServiceFunc($injector),
        getFeedPollingLocations: karmaUtil.setupServiceFunc($injector),
        getFeedContests: karmaUtil.setupServiceFunc($injector),
        getFeedResults: karmaUtil.setupServiceFunc($injector),
        getFeedLocalities: karmaUtil.setupServiceFunc($injector)
      }

      $httpBackend = $injector.get('$httpBackend');
      feedData = [ {date: '2011-11-01', state: 'Ohio', type: 'Federal', status: 'Undetermined'} ];
      $rootScope = $injector.get('$rootScope');
      karmaUtil.setupControllerTest($injector, feedData, $httpBackend, $rootScope, 'FeedOverviewCtrl', mockService);
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    })

    it('should have valid data', function () {
      $httpBackend.flush();
      expect($rootScope.feedData).toEqual(feedData);
      expect($rootScope.feedPollingLocations).toEqual(feedData);
      expect($rootScope.feedContests).toEqual(feedData);
      expect($rootScope.feedResults).toEqual(feedData);
      expect($rootScope.feedLocalities).toEqual(feedData);
    });
  });
});