/**
 * Created by rcartier13 on 1/31/14.
 */

describe('Feed Electoral Districts Unit Tests', function() {

  describe('Feed Electoral Districts Controller Test', function() {
    var $rootScope = null;
    var $httpBackend = null;
    var feedData;

    beforeEach(inject(function($injector) {
      var mockService = {
        getFeedData: karmaUtil.setupServiceFunc($injector),
        getFeedElectoralDistricts: karmaUtil.setupServiceFunc($injector)
      }
      $httpBackend = $injector.get('$httpBackend');
      $rootScope = $injector.get('$rootScope');
      feedData = {something: 'something'};
      karmaUtil.setupControllerTest($injector, feedData, $httpBackend, $rootScope, 'FeedElectoralDistrictsCtrl', mockService);
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should have valid data', function() {
      $httpBackend.flush();
      expect($rootScope.feedData).toEqual(feedData);
      expect($rootScope.feedElectoralDistricts).toEqual(feedData);
    });
  });
});