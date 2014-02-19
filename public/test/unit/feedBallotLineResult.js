/**
 * Created by rcartier13 on 1/30/14.
 */

describe('Feed Ballot Line Result Unit Tests', function() {

  describe('Feed Contest Controller Test', function() {
    var $rootScope = null;
    var $httpBackend = null;
    var feedData;

    beforeEach(inject(function($injector) {
      var mockService = {
        getFeedData: karmaUtil.setupServiceFunc($injector),
        getFeedBallotLineResult: karmaUtil.setupServiceFunc($injector)
      }
      $httpBackend = $injector.get('$httpBackend');
      $rootScope = $injector.get('$rootScope');
      feedData = {something: 'something', contest: { self: 'self' }, jurisdiction: { self: 'self' }, candidate: { self: 'self' }};
      karmaUtil.setupControllerTest($injector, feedData, $httpBackend, $rootScope, 'FeedBallotLineResultCtrl', mockService);
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should have valid data', function() {
      $httpBackend.flush();
      expect($rootScope.feedData).toEqual(feedData);
      expect($rootScope.feedBallotLineResult).toEqual(feedData);
    });
  });
});