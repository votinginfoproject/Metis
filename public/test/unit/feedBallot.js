/**
 * Created by rcartier13 on 1/28/14.
 */


describe('Feed Contest Unit Tests', function() {

  describe('Feed Contest Controller Test', function() {
    var $rootScope = null;
    var $httpBackend = null;
    var feedData;

    beforeEach(inject(function($injector) {
      var mockService = {
        getFeedData: karmaUtil.setupServiceFunc($injector),
        getFeedBallot: karmaUtil.setupServiceFunc($injector)
      }
      $httpBackend = $injector.get('$httpBackend');
      $rootScope = $injector.get('$rootScope');
      feedData = {custom_ballot: {}};
      karmaUtil.setupControllerTest($injector, feedData, $httpBackend, $rootScope, 'FeedBallotCtrl', mockService);
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should have valid data', function() {
      $httpBackend.flush();
      expect($rootScope.feedData).toEqual(feedData);
      expect($rootScope.feedBallot).toEqual(feedData);
    });
  });
});