/**
 * Created by rcartier13 on 1/29/14.
 */

describe('Feed Referenda Unit Tests', function() {

  describe('Feed Referenda Controller Test', function() {
    var $rootScope = null;
    var $httpBackend = null;
    var feedData;

    beforeEach(inject(function($injector) {
      var mockService = {
        getFeedData: karmaUtil.setupServiceFunc($injector),
        getFeedReferenda: karmaUtil.setupServiceFunc($injector)
      }

      $httpBackend = $injector.get('$httpBackend');
      feedData = { something: 'something' };
      $rootScope = $injector.get('$rootScope');
      karmaUtil.setupControllerTest($injector, feedData, $httpBackend, $rootScope, 'FeedReferendaCtrl', mockService);
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should have valid data', function() {
      $httpBackend.flush();
      expect($rootScope.feedData).toEqual(feedData);
      expect($rootScope.feedReferenda).toEqual(feedData);
    });
  });
});