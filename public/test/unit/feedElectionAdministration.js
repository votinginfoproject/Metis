/**
 * Created by rcartier13 on 1/31/14.
 */

describe('Feed Election Administration Unit Tests', function() {

  describe('Feed Election Administration Controller Test', function() {
    var $rootScope = null;
    var $httpBackend = null;
    var feedData;

    beforeEach(inject(function($injector) {
      var mockService = {
        getFeedData: karmaUtil.setupServiceFunc($injector),
        getFeedElectionAdministration: karmaUtil.setupServiceFunc($injector)
      }
      $httpBackend = $injector.get('$httpBackend');
      $rootScope = $injector.get('$rootScope');
      feedData = {something: 'something'};
      karmaUtil.setupControllerTest($injector, feedData, $httpBackend, $rootScope, 'FeedElectionAdministrationCtrl', mockService);
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should have valid data', function() {
      $httpBackend.flush();
      expect($rootScope.feedData).toEqual(feedData);
      expect($rootScope.feedElectionAdministration).toEqual(feedData);
    });
  });
});