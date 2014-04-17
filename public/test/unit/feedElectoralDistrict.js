/**
 * Created by rcartier13 on 1/31/14.
 */

describe('Feed Electoral District Unit Tests', function() {

  describe('Feed Electoral District Controller Test', function() {
    var $rootScope = null;
    var $httpBackend = null;
    var feedData;

    beforeEach(inject(function($injector) {
      var mockService = {
        getFeedData: karmaUtil.setupServiceFunc($injector),
        getFeedElectoralDistrict: karmaUtil.setupServiceFunc($injector)
      }
      $httpBackend = $injector.get('$httpBackend');
      $rootScope = $injector.get('$rootScope');
      feedData = {something: 'something'};
      karmaUtil.setupControllerTest($injector, feedData, $httpBackend, $rootScope, 'FeedElectoralDistrictCtrl', mockService);
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should have valid data', function() {
      $httpBackend.flush();
      expect($rootScope.feedData).toEqual(feedData);
      expect($rootScope.feedElectoralDistrict).toEqual(feedData);
    });
  });
});