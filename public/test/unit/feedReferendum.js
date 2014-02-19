/**
 * Created by rcartier13 on 1/29/14.
 */

describe('Feed Referendum Unit Tests', function() {

  describe('Feed Referendum Controller Test', function() {
    var $rootScope = null;
    var $httpBackend = null;
    var feedData;

    beforeEach(inject(function($injector) {
      var mockService = {
        getFeedData: karmaUtil.setupServiceFunc($injector),
        getFeedReferendum: karmaUtil.setupServiceFunc($injector)
      }

      $httpBackend = $injector.get('$httpBackend');
      feedData = { something: 'something' };
      $rootScope = $injector.get('$rootScope');
      karmaUtil.setupControllerTest($injector, feedData, $httpBackend, $rootScope, 'FeedReferendumCtrl', mockService);
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should have valid data', function() {
      $httpBackend.flush();
      expect($rootScope.feedData).toEqual(feedData);
      expect($rootScope.feedReferendum).toEqual(feedData);
    });
  });
});