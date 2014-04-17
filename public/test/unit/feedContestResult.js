/**
 * Created by rcartier13 on 1/30/14.
 */

describe('Feed Contest Result Unit Tests', function() {

  describe('Feed Contest Result Controller Test', function() {
    var $rootScope = null;
    var $httpBackend = null;
    var feedData;

    beforeEach(inject(function($injector) {
      var mockService = {
        getFeedData: karmaUtil.setupServiceFunc($injector),
        getFeedContestResult: karmaUtil.setupServiceFunc($injector)
      };

      $httpBackend = $injector.get('$httpBackend');
      feedData = { something: 'something', contest: { self: 'self' }, jurisdiction: { self: 'self' } };
      $rootScope = $injector.get('$rootScope');
      karmaUtil.setupControllerTest($injector, feedData, $httpBackend, $rootScope, 'FeedContestResultCtrl', mockService);
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should have valid data', function() {
      $httpBackend.flush();
      expect($rootScope.feedData).toEqual(feedData);
      expect($rootScope.feedContestResult).toEqual(feedData);
    });
  });
});